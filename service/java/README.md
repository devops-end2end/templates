Backstage software template skeleton for a Java (Spring Boot) microservice.

This skeleton includes a standard Maven project layout, Spring Boot Web configuration running on port 8000, the required JSON response payload, a dedicated /health endpoint, unit/integration tests with MockMvc, and Backstage scaffolding descriptors (template.yaml and catalog-info.yaml).

Key Architecture
Spring Boot 3.3+ & Java 21 Standard: Utilizes modern LTS Java features and structured starter dependencies.

Port Configuration: Explicitly bound to port 8000 via application.properties.

Required Endpoints:

    Root endpoint (/): Returns dynamic JSON matching { "message": "Welcome to <app_name>", "status": "healthy", "docs_url": "/docs" }.

    Health endpoint (/health): Dedicated status check returning Spring Boot actuator-compatible health payload.

Automated Testing: Includes @WebMvcTest integration tests validating controller contracts out of the box.

Backstage Scaffolding Integration: Complete template.yaml featuring parameter prompts for Entity naming, owner selection, GitHub publishing actions, and auto-registration into the Backstage software catalog.
