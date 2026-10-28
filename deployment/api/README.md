# API Deployment Template

This directory contains the **Backstage Scaffolder Template** for bootstrapping Kubernetes deployment manifests and ArgoCD configurations for HTTP/REST API services into the central **GitOps repository** (`devops-end2end/gitops`).

When an engineer triggers this template in Backstage, it generates a production-ready, multi-environment GitOps layout under `/apps/<componentId>` and opens an automated Pull Request in the `gitops` repository.

---

## Architecture & Workflow

```text
[ Developer in Backstage ]
          │
          ▼
Selects "API Deployment Template"
(Enters componentId, description, owner)
          │
          ▼
Backstage Scaffolder renders manifests from skeleton
          │
          ▼
Backstage opens PR against github.com/devops-end2end/gitops
(Branch: feat/add-deployment-<componentId>, Target: /apps/<componentId>)
          │
          ▼
Platform Team / Engineer Reviews & Merges PR
          │
          ▼
ArgoCD detects ApplicationSets in apps/<componentId>/release-configs/
          │
          ▼
ArgoCD deploys the API microservice to Test & Prod clusters
```

---

## Template Inputs & Execution

### Phase 1: Backstage Form Parameters
* **`componentId`**: The unique identifier of the API service (e.g., `py-app15`).
* **`description`**: A concise description of the service.
* **`owner`**: The owning team selected via Backstage's `OwnerPicker` (defaults to `group:default/platform-engineering`).

### Phase 2: Scaffolder Actions
1. **`fetch:template`**:
   * Reads `./skeleton` (`base/`, `env/`, `release-configs/`).
   * Evaluates all `${{ values.componentId }}`, `${{ values.description }}`, and `${{ values.owner }}` expressions.
   * Stashes the rendered files in `./gitops-staging`.
2. **`publish:github:pull-request`**:
   * Clones `devops-end2end/gitops`.
   * Branches to `feat/add-deployment-${{ parameters.componentId }}`.
   * Places rendered files at `apps/${{ parameters.componentId }}`.
   * Creates a PR on GitHub with title `"feat(<componentId>): add deployment configurations"`.

### Phase 3: Scaffolder Output
* Displays a clickable link directly to the newly created GitOps Pull Request.

---

## Generated GitOps Directory Structure

The template generates the following layout inside `devops-end2end/gitops`:

```text
gitops/
  └── apps/
      └── <componentId>/
          ├── base/
          │    ├── config.conf             # Baseline environment variables (APP_PORT, APP_ENV, etc.)
          │    ├── deployment.yaml         # Deployment manifest (Wave 0, port 8000, imagePullSecrets)
          │    ├── service.yaml            # ClusterIP Service (Wave 1, port 8000)
          │    ├── httproute.yaml          # Gateway API HTTPRoute (Wave 2, binds to service)
          │    ├── kustomizeconfig.yaml    # NameReference mapping HTTPRoute backendRefs to Service
          │    └── kustomization.yaml      # Bundles base resources & kustomize configuration
          ├── env/
          │    ├── test-home1/             # Test environment overlay
          │    │    ├── config.conf        # Test overrides (APP_ENVIRONMENT=test, APP_DEBUG=true)
          │    │    ├── patch-deployment.yaml # Test resources (50m CPU / 128Mi RAM, 1 replica)
          │    │    └── kustomization.yaml # namespace: test, nameSuffix: -test-home1
          │    └── prod-home1/             # Production environment overlay
          │         ├── config.conf        # Prod overrides (APP_ENVIRONMENT=production, APP_DEBUG=false)
          │         ├── patch-deployment.yaml # Prod resources (100m CPU / 256Mi RAM, 2 replicas - HA)
          │         └── kustomization.yaml # namespace: prod, nameSuffix: -prod-home1
          └── release-configs/
               ├── test.yaml               # ArgoCD ApplicationSet targeting test-home1
               └── prod.yaml               # ArgoCD ApplicationSet targeting prod-home1
```

---

## Core Technical Standards

### 1. ArgoCD Sync-Wave Ordering (Deadlock Prevention)
ArgoCD evaluates sync waves sequentially (`0` ➔ `1` ➔ `2`) and blocks subsequent waves until earlier waves are Healthy:
* **Wave 0 — [`deployment.yaml`](file:///home/iarjune/Documents/Labs/DevOps/templates/deployment/api/skeleton/base/deployment.yaml):**
  Spins up the pod workload with `ecr-docker-secret` image pull credentials and port `8000`.
* **Wave 1 — [`service.yaml`](file:///home/iarjune/Documents/Labs/DevOps/templates/deployment/api/skeleton/base/service.yaml):**
  Creates the Kubernetes `ClusterIP` Service and endpoint controller mappings.
* **Wave 2 — [`httproute.yaml`](file:///home/iarjune/Documents/Labs/DevOps/templates/deployment/api/skeleton/base/httproute.yaml):**
  Configures the Envoy Gateway `HTTPRoute`. **Must run in Wave 2** so the backend `Service` is already healthy when Envoy reconciles the route, preventing `BackendNotFound` reconciliation lockups.

### 2. Automated Suffix Resolution via `kustomizeconfig.yaml`
Because Gateway API's `HTTPRoute` is a Custom Resource (CRD), Kustomize does not natively know that `spec.rules[].backendRefs[].name` refers to a Kubernetes `Service`. 

[`kustomizeconfig.yaml`](file:///home/iarjune/Documents/Labs/DevOps/templates/deployment/api/skeleton/base/kustomizeconfig.yaml) defines a custom `nameReference`:
```yaml
nameReference:
  - kind: Service
    version: v1
    fieldSpecs:
      - path: spec/rules/backendRefs/name
        kind: HTTPRoute
        group: gateway.networking.k8s.io
```
When an overlay applies `nameSuffix` (e.g., `-test-home1` or `-prod-home1`):
* The `Service` is renamed to `<componentId>-test-home1`.
* Kustomize **automatically updates** `HTTPRoute.spec.rules[].backendRefs[].name` to `<componentId>-test-home1`.
* No duplicate gateway patches are required in overlays.

### 3. API Runtime Standards
* **Container & Target Port:** Standardized on `8000` (FastAPI / Uvicorn).
* **Health Probes:** Configured for `/api/v1/health/` (Startup, Liveness, and Readiness).
* **Configuration:** Environment variables in `config.conf` use the `APP_` prefix to automatically map to application settings models.