# Deployment

> Back to [README](../README.md)

## Environments & Profiles

The project supports **5 environments** with dedicated infrastructure profiles:

| Env   | Profile          | Description                                  | Infra Tools                                   |
|-------|------------------|----------------------------------------------|-----------------------------------------------|
| LOCAL | `local-docker`   | Docker Compose on your machine               | Docker Compose                                |
| LOCAL | `local-k8s`      | Minikube cluster with Helm charts            | Helm + Minikube                               |
| INT   | `azure-int`      | Integration — Azure VM with Docker           | Packer, Terraform, Ansible, Docker Compose    |
| UAT   | `azure-uat`      | User Acceptance Testing — Azure PaaS         | Terraform, Azure Vault, Azure PaaS            |
| OAT   | `azure-oat`      | Operational Acceptance Testing — Azure AKS   | Terraform, Helm, AKS, Azure Vault             |
| PRD   | `azure-prd`      | Production — Azure AKS                       | Terraform, Helm, AKS, Azure Vault             |

### Environment Purpose

| Env   | Purpose                                                                |
|-------|------------------------------------------------------------------------|
| LOCAL | Developer workstation — fast feedback loop, hot-reload, debugging      |
| INT   | First cloud env — validate Docker images on a real Azure VM            |
| UAT   | Business validation — Azure managed services, close to production      |
| OAT   | Pre-production — full AKS cluster, performance & operational testing   |
| PRD   | Production — same AKS stack as OAT, real users                        |

### Service Mapping Across Environments

| Service            | LOCAL (docker)          | LOCAL (k8s)       | INT (azure-int)              | UAT (azure-uat)                | OAT (azure-oat)              | PRD (azure-prd)               |
|--------------------|-------------------------|-------------------|------------------------------|--------------------------------|-------------------------------|-------------------------------|
| Database           | PostgreSQL (container)  | PostgreSQL (Helm) | PostgreSQL (Docker)          | Azure Database for PostgreSQL  | Azure Database for PostgreSQL | Azure Database for PostgreSQL |
| Messaging          | Kafka + Schema Registry | Kafka (Helm)      | Kafka (Docker)               | Azure Event Hubs               | Azure Event Hubs              | Azure Event Hubs              |
| Object Storage     | Minio S3                | Minio (Helm)      | Minio (Docker)               | Azure Blob Storage             | Azure Blob Storage            | Azure Blob Storage            |
| Identity           | Keycloak (container)    | Keycloak (Helm)   | Keycloak (Docker)            | Keycloak (Azure VM)            | Keycloak (Azure VM)           | Keycloak (Azure VM)           |
| Backend            | Spring Boot (local JVM) | K8s Deployment    | Docker container (VM)        | Azure App Service              | K8s Deployment (AKS)          | K8s Deployment (AKS)          |
| Frontend           | Angular dev server      | K8s Deployment    | Docker container (VM)        | Azure Static Web App           | K8s Deployment (AKS)          | K8s Deployment (AKS)          |
| Container Registry | —                       | Minikube local    | Azure ACR                    | Azure ACR                      | Azure ACR                     | Azure ACR                     |
| Ingress            | —                       | NGINX Ingress     | Nginx (VM)                   | Azure managed                  | NGINX Ingress (AKS)           | NGINX Ingress (AKS)           |
| Secrets            | `.env` file             | K8s Secrets       | Ansible Vault                | Azure Key Vault                | Azure Key Vault               | Azure Key Vault               |
| IaC                | Docker Compose          | Helm              | Packer + Terraform + Ansible | Terraform                      | Terraform + Helm              | Terraform + Helm              |

---

## Prerequisites

### Common (all environments)

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

### Per-Environment Prerequisites

| Profile        | Extra prerequisites                                      |
|----------------|----------------------------------------------------------|
| `local-docker` | —                                                        |
| `local-k8s`    | Minikube, kubectl, Helm 3                                |
| `azure-int`    | Azure CLI, Terraform >= 1.5, Packer, Ansible             |
| `azure-uat`    | Azure CLI, Terraform >= 1.5                              |
| `azure-oat`    | Azure CLI, Terraform >= 1.5, kubectl, Helm 3             |
| `azure-prd`    | Azure CLI, Terraform >= 1.5, kubectl, Helm 3             |

---

## Getting Started

### Option A — One Command (Makefile)

```bash
make all              # Start local infra + backend + frontend
make stop             # Stop everything
make help             # Show all available targets
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

#### LOCAL — Docker Compose (`local-docker`)

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
| Backend API     | http://localhost:8080/api                 | —                                  |
| Swagger UI      | http://localhost:8080/api/swagger-ui.html | —                                  |
| Frontend        | http://localhost:4200                     | —                                  |
| PostgreSQL      | localhost:5432                            | `aliexpress` / `aliexpress_secret` |
| Kafka           | localhost:9092                            | —                                  |
| Schema Registry | http://localhost:8081                     | —                                  |
| Kafka UI        | http://localhost:9090                     | —                                  |
| Minio Console   | http://localhost:9001                     | `minioadmin` / `minioadmin`        |
| Keycloak Admin  | http://localhost:8180                     | `admin` / `admin`                  |

#### LOCAL — Kubernetes (`local-k8s`)

```bash
# One-command bootstrap
cd infra/k8s/local/scripts
chmod +x setup-minikube.sh
./setup-minikube.sh

# Add to /etc/hosts:
# <minikube-ip>  mini-aliexpress.local
```

Then open http://mini-aliexpress.local

#### INT — Azure VM (`azure-int`)

```bash
# 1. Build VM image with Packer
cd infra/packer
packer init .
packer build -var-file=variables.pkrvars.hcl .

# 2. Provision Azure resources with Terraform
cd infra/terraform/environments/azure-int
cp terraform.tfvars.example terraform.tfvars   # edit with your values
terraform init && terraform plan && terraform apply

# 3. Configure VM with Ansible
cd infra/ansible
ansible-playbook -i inventory/azure-int playbooks/deploy.yml
```

#### UAT — Azure PaaS (`azure-uat`)

```bash
# Provision Azure managed services with Terraform
cd infra/terraform/environments/azure-uat
cp terraform.tfvars.example terraform.tfvars   # edit with your values
terraform init && terraform plan && terraform apply

# Outputs will show all service URLs
terraform output
```

#### OAT — Azure AKS (`azure-oat`)

```bash
# 1. Provision AKS cluster + Azure services with Terraform
cd infra/terraform/environments/azure-oat
cp terraform.tfvars.example terraform.tfvars   # edit with your values
terraform init && terraform plan && terraform apply

# 2. Deploy workloads with Helm
cd infra/k8s/azure-aks/scripts
chmod +x deploy-aks.sh
export RESOURCE_GROUP="mini-aliexpress-oat-rg"
export AKS_CLUSTER="mini-aliexpress-oat-aks"
export ACR_NAME="minialiexpressacr"
export ENVIRONMENT="oat"
./deploy-aks.sh
```

#### PRD — Azure AKS (`azure-prd`)

```bash
# 1. Provision AKS cluster + Azure services with Terraform
cd infra/terraform/environments/azure-prd
cp terraform.tfvars.example terraform.tfvars   # edit with your values
terraform init && terraform plan && terraform apply

# 2. Deploy workloads with Helm
cd infra/k8s/azure-aks/scripts
chmod +x deploy-aks.sh
export RESOURCE_GROUP="mini-aliexpress-prd-rg"
export AKS_CLUSTER="mini-aliexpress-prd-aks"
export ACR_NAME="minialiexpressacr"
export ENVIRONMENT="prd"
./deploy-aks.sh
```

---

## CI/CD Pipeline per Environment

| Env   | Trigger                        | Pipeline Steps                                              |
|-------|--------------------------------|-------------------------------------------------------------|
| LOCAL | Developer runs `make all`      | Docker Compose up, backend run, frontend serve              |
| INT   | Push to `main` (CI passes)     | Packer build, Terraform apply, Ansible deploy               |
| UAT   | Manual approval / tag          | Terraform apply (Azure PaaS), deploy app                    |
| OAT   | Release candidate tag          | Terraform apply (AKS oat), Helm upgrade                     |
| PRD   | Manual approval after OAT      | Terraform apply (AKS prd), Helm upgrade                     |

---

## Makefile Reference

```bash
# ── Local Development ──
make all                  # Start infra + backend + frontend (local-docker)
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

# ── Testing ──
make test                 # Run all unit tests (backend + frontend)
make test-integration     # Run Testcontainers integration tests
make test-cucumber        # Run Cucumber BDD tests
make test-performance     # Run Gatling performance tests
make test-mutation        # Run PITest mutation tests

# ── Security & Quality ──
make security-scan        # Run OWASP + Trivy scans
make sonar                # Run SonarQube analysis

# ── Docker & Deployment ──
make docker-build         # Build backend + frontend Docker images

make deploy-int           # Deploy to INT  (Packer + Terraform + Ansible)
make deploy-uat           # Deploy to UAT  (Terraform Azure PaaS)
make deploy-oat           # Deploy to OAT  (Terraform + Helm AKS, verbose logging)
make deploy-prd           # Deploy to PRD  (Terraform + Helm AKS, production)
```
