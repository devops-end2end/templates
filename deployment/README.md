This template is a **Backstage Scaffolder Template** that automates bootstrapping Kubernetes deployment manifests and ArgoCD configurations for a Python service into your central **GitOps repository** (`devops-end2end/gitops`).

Here is a step-by-step breakdown of what happens when a developer runs it:

---

### Phase 1: Collects Input from the User (Lines 18–41)
When an engineer selects this template in the Backstage UI, they are presented with a form requesting:
1. **`componentId`** (e.g. `py-service-1`): The name of the service to deploy.
2. **`description`**: A short description of the service.
3. **`owner`**: The owning team selected via Backstage's `OwnerPicker` (defaults to `group:default/platform-engineering`).

---

### Phase 2: Execution Steps in Backstage (Lines 42–69)

#### Step 1: `fetch-deployment-templates` (Lines 45–54)
* **Action:** `fetch:template`
* **What it does:** 
  1. Reads all files from the local [`./skeleton`](file:///home/iarjune/Documents/Labs/DevOps/templates/deployment/api-python/skeleton) directory (`base/`, `env/`, `release-configs/`).
  2. Dynamically replaces all `${{ values.componentId }}` placeholders with the user's input (e.g. replacing image names, deployment names, service names, health paths).
  3. Writes the rendered Kubernetes and ArgoCD manifests into a temporary staging folder (`./gitops-staging`) inside the Backstage runner workspace.

#### Step 2: `publish-gitops-pr` (Lines 56–69)
* **Action:** `publish:github:pull-request`
* **What it does:**
  1. Clones the central GitOps repository: `github.com/devops-end2end/gitops`.
  2. Creates a new feature branch: `feat/add-deployment-<componentId>`.
  3. Copies the staged files from `./gitops-staging` directly into `apps/<componentId>/` inside the `gitops` repository:
     ```text
     gitops/
       └── apps/
           └── <componentId>/
               ├── base/
               │    ├── config.conf
               │    ├── deployment.yaml
               │    ├── gateway.yaml
               │    └── kustomization.yaml
               ├── env/
               │    ├── prod-home-lab/
               │    └── test-home-lab/
               └── release-configs/
                    ├── prod.yaml
                    └── test.yaml
     ```
  4. Commits the changes and opens a **Pull Request** against the `main` branch of `devops-end2end/gitops` with the title:
     `"feat(<componentId>): add deployment configurations"`.

---

### Phase 3: Completion & Outputs (Lines 70–74)
Upon successful execution, Backstage displays a completion screen with a direct clickable link:
* **"GitOps Pull Request"** ➔ Links directly to the newly opened PR on GitHub so the developer or platform team can review and merge it.

---

### How It Fits into Your Workflow

```text
[ Developer in Backstage ]
          │
          ▼
Selects "Python API Deployment Template"
          │
          ▼
Backstage renders K8s/Kustomize/ArgoCD manifests
          │
          ▼
Backstage opens PR on github.com/devops-end2end/gitops
          │
          ▼
PR Merged into gitops repo
          │
          ▼
ArgoCD detects ApplicationSets in apps/<componentId>/release-configs/
          │
          ▼
ArgoCD deploys the Python microservice to test/prod clusters
```