# Deployment

> Back to [README](../README.md)

## Deployment Profiles

The project supports **4 deployment profiles**, each with its own infrastructure setup:

| # | Profile            | Description                         | Infra Tool       |
|---|--------------------|-------------------------------------|------------------|
| 1 | **local**          | Docker Compose on your machine      | Docker Compose   |
| 2 | **local-k8s**      | Minikube cluster with Helm charts   | Helm + Minikube  |
| 3 | **azure-aks**      | Full AKS cluster on Azure           | Terraform + Helm |
| 4 | **azure-services** | Azure PaaS services (no Kubernetes) | Terraform        |

### Service Mapping Across Profiles

| Service            | local                   | local-k8s         | azure-aks         | azure-services                |
|--------------------|-------------------------|-------------------|-------------------|-------------------------------|
| Database           | PostgreSQL (container)  | PostgreSQL (Helm) | PostgreSQL (Helm) | Azure Database for PostgreSQL |
| Messaging          | Kafka + Schema Registry | Kafka (Helm)      | Kafka (Helm)      | Azure Event Hubs              |
| Object Storage     | Minio S3                | Minio (Helm)      | Minio (Helm)      | Azure Blob Storage            |
| Identity           | Keycloak (container)    | Keycloak (Helm)   | Keycloak (Helm)   | Keycloak (Azure VM)           |
| Backend            | Spring Boot (local JVM) | K8s Deployment    | K8s Deployment    | Azure App Service             |
| Frontend           | Angular dev server      | K8s Deployment    | K8s Deployment    | Azure Static Web App          |
| Container Registry | -                       | Minikube local    | Azure ACR         | Azure ACR                     |
| Ingress            | -                       | NGINX Ingress     | NGINX Ingress     | Azure managed                 |

---

## Prerequisites

- **Java** 17+ (managed via [jenv](https://www.jenv.be/) — `.java-version` pinned at project root)
- **Node.js** 22+ and **npm** (managed via [nvm](https://github.com/nvm-sh/nvm) — `.nvmrc` pinned at project root)
- **Docker** & **Docker Compose**
- **Maven** 3.9+ (or use the included `mvnw` wrapper)
- **Angular CLI** 18 (`npm install -g @angular/cli`)

### Version Setup

```bash
# Java — jenv reads .java-version automatically
jenv local          # should show 17.0

# Node — nvm reads .nvmrc
nvm use             # switches to v22
```

Additional for specific profiles:

| Profile        | Extra prerequisites                          |
|----------------|----------------------------------------------|
| local-k8s      | Minikube, kubectl, Helm 3                    |
| azure-aks      | Azure CLI, Terraform >= 1.5, kubectl, Helm 3 |
| azure-services | Azure CLI, Terraform >= 1.5                  |

---

## Getting Started

### Option A — One Command (Makefile)

```bash
make all          # Start infra + backend + frontend
make stop         # Stop everything
make help         # Show all available targets
```

### Option B — IntelliJ IDEA (with debug)

The project includes shared IntelliJ Run Configurations (`.run/` directory). Open the project in IntelliJ and select
from the **Run** dropdown:

| Configuration                        | Type        | Action                                                   |
|--------------------------------------|-------------|----------------------------------------------------------|
| **All (Infra + Backend + Frontend)** | Compound    | Launches everything in one click                         |
| **Infra (Docker Compose)**           | Docker      | Starts PostgreSQL, Kafka, Minio, Keycloak                |
| **Backend (Local)**                  | Spring Boot | Runs backend with `local` profile (supports breakpoints) |
| **Frontend (ng serve)**              | npm         | Starts Angular dev server                                |
| **Backend Tests**                    | JUnit       | Runs all backend tests                                   |

To **debug the backend**: select `Backend (Local)` and click the **Debug** button. Set breakpoints anywhere in the code.

### Option C — Manual (Step by Step)

#### Profile 1 — Local (Docker Compose)

```bash
# 1. Start all infrastructure services
cd infra/docker/local
docker compose up -d

# 2. Run the backend
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# 3. Run the frontend
cd frontend
npm install && ng serve
```

| Service         | URL                                       | Credentials                        |
|-----------------|-------------------------------------------|------------------------------------|
| Backend API     | http://localhost:8080/api                 | -                                  |
| Swagger UI      | http://localhost:8080/api/swagger-ui.html | -                                  |
| Frontend        | http://localhost:4200                     | -                                  |
| PostgreSQL      | localhost:5432                            | `aliexpress` / `aliexpress_secret` |
| Kafka           | localhost:9092                            | -                                  |
| Schema Registry | http://localhost:8081                     | -                                  |
| Kafka UI        | http://localhost:9090                     | -                                  |
| Minio Console   | http://localhost:9001                     | `minioadmin` / `minioadmin`        |
| Keycloak Admin  | http://localhost:8180                     | `admin` / `admin`                  |

#### Profile 2 — Local Kubernetes (Minikube)

```bash
# One-command bootstrap
cd infra/k8s/local/scripts
chmod +x setup-minikube.sh
./setup-minikube.sh

# Add to /etc/hosts:
# <minikube-ip>  mini-aliexpress.local
```

Then open http://mini-aliexpress.local

#### Profile 3 — Azure AKS

```bash
# 1. Provision AKS cluster with Terraform
cd infra/terraform/environments/azure-aks
cp terraform.tfvars terraform.tfvars.local   # edit with your values
terraform init && terraform plan && terraform apply

# 2. Deploy workloads with Helm
cd infra/k8s/azure-aks/scripts
chmod +x deploy-aks.sh
export RESOURCE_GROUP="mini-aliexpress-aks-rg"
export AKS_CLUSTER="mini-aliexpress-aks"
export ACR_NAME="minialiexpressacr"
./deploy-aks.sh
```

#### Profile 4 — Azure Services (PaaS, no Kubernetes)

```bash
# Provision everything with Terraform
cd infra/terraform/environments/azure-services
cp terraform.tfvars terraform.tfvars.local   # edit with your values
terraform init && terraform plan && terraform apply

# Outputs will show all service URLs
terraform output
```

---

## Makefile Reference

```bash
make all                  # Start infra + backend + frontend
make stop                 # Stop everything
make clean                # Stop + remove volumes + clean builds

make infra                # Start Docker Compose services
make infra-down           # Stop Docker Compose services
make infra-logs           # Tail infrastructure logs
make infra-ps             # Show running containers

make backend              # Start Spring Boot backend
make backend-build        # Build backend JAR
make backend-test         # Run backend unit tests

make frontend             # Start Angular dev server
make frontend-install     # Install npm dependencies
make frontend-build       # Build for production
make frontend-test        # Run frontend unit tests

make test                 # Run all unit tests (backend + frontend)
make test-integration     # Run Testcontainers integration tests
make test-cucumber        # Run Cucumber BDD tests
make test-performance     # Run Gatling performance tests
make test-mutation        # Run PITest mutation tests

make security-scan        # Run OWASP + Trivy scans
make sonar                # Run SonarQube analysis
make docker-build         # Build backend + frontend Docker images
```
