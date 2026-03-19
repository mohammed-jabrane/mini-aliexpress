# Mini AliExpress

A full-stack e-commerce platform inspired by AliExpress, built as a mini project (TP) to demonstrate modern software architecture and best practices.

## Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Language |
| Spring Boot | 3.5 | Application framework |
| Spring Data JPA | - | Data access layer |
| PostgreSQL | 16 | Relational database |
| Liquibase | - | Database schema versioning & migrations |
| Kafka | 3.4 | Asynchronous messaging / event streaming |
| Confluent Schema Registry | 7.6 | Schema management for Kafka (Avro/JSON) |
| Minio (S3) | - | Object storage (product images, assets) |
| Keycloak | 26 | Identity & access management (OAuth2 / OIDC) |
| SpringDoc OpenAPI | 2.8 | API documentation (Swagger UI) |
| Lombok | - | Boilerplate reduction |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Angular | 18 | SPA framework (standalone components) |
| Angular Material | 18 | UI component library (toolbar, snackbar, dialogs) |
| TypeScript | 5.5 | Language |
| NgRx | - | Reactive state management (Store, Effects, Selectors) |
| Angular Signals | - | Fine-grained reactivity (auth state, component state) |
| Keycloak Angular | 16 | OAuth2/OIDC integration (SSO, bearer interceptor) |
| Lazy Loading | - | Route-level code splitting |
| Mappers | - | DTO-to-Model transformation layer |
| RxJS | 7.8 | Reactive programming |

### Testing & Quality

| Technology | Version | Purpose |
|---|---|---|
| JUnit 5 | - | Backend unit testing |
| Mockito | - | Mocking framework |
| Testcontainers | - | Integration tests (PostgreSQL, Kafka, Minio) |
| Cucumber | 7.21 | BDD functional tests (Gherkin) |
| Jasmine + Karma | - | Frontend unit testing |
| Cypress | - | E2E testing |
| Gatling | 4.12 | Performance / load testing |
| PITest | 1.17 | Mutation testing |
| Trivy | - | Container & dependency CVE scanning |
| OWASP Dependency-Check | 11.1 | SCA (known CVEs in dependencies) |
| OWASP ZAP | - | DAST (runtime vulnerability scanning) |
| SonarCloud | - | Code quality, security hotspots, coverage (hosted) |
| Checkmarx | - | SAST (static code analysis) |
| Checkov | - | Terraform IaC security scanning |

### Infrastructure & DevOps

| Technology | Purpose | Environments |
|---|---|---|
| Docker / Docker Compose | Container orchestration | LOCAL, INT |
| Kubernetes / Helm | Container orchestration | LOCAL (Minikube), OAT, PRD (AKS) |
| Terraform | Infrastructure as Code | INT, UAT, OAT, PRD |
| Packer | VM image building | INT |
| Ansible | Configuration management | INT |
| Azure AKS | Managed Kubernetes | OAT, PRD |
| Azure PaaS | Blob Storage, Event Hubs, PostgreSQL, Key Vault | UAT, OAT, PRD |
| Azure Key Vault | Secrets management | UAT, OAT, PRD |
| Maven | Backend build & dependency management | All |
| Angular CLI | Frontend build tooling | All |
| Make | Project orchestration (Makefile) | All |

---

## Functional Features

### Product Catalog

| Feature | Description |
|---|---|
| Product Listing | Browse products with pagination, filtering & sorting |
| Product Search | Full-text search by name, category, keywords |
| Product Detail | View product info, images gallery, seller details |
| Category Navigation | Hierarchical category tree with breadcrumb |
| Image Upload | Sellers upload product images (stored in Minio / Blob Storage) |

### Shopping Cart

| Feature | Description |
|---|---|
| Add to Cart | Add products with quantity selection |
| Update Quantity | Increment / decrement / remove items |
| Cart Persistence | Cart state persisted per authenticated user |
| Price Calculation | Real-time subtotal, shipping estimation, total |

### Order Management

| Feature | Description |
|---|---|
| Checkout Flow | Address selection, payment method, order review |
| Order Placement | Validate stock, create order, emit Kafka event |
| Order Tracking | View order status history (PENDING, PAID, SHIPPED, DELIVERED) |
| Order History | List past orders with filtering by status / date |

### User & Authentication

| Feature | Description |
|---|---|
| Registration | Self-registration via Keycloak |
| Login / Logout | OAuth2 / OIDC authentication (Authorization Code + PKCE) |
| Role-based Access | `ROLE_USER` (buy), `ROLE_SELLER` (manage products), `ROLE_ADMIN` (platform admin) |
| User Profile | View & edit profile, manage addresses, upload avatar |

### Seller Dashboard

| Feature | Description |
|---|---|
| Product CRUD | Create, update, delete products with image management |
| Inventory Management | Track stock levels, receive low-stock alerts |
| Order Fulfillment | View incoming orders, update shipping status |
| Sales Analytics | Basic revenue & order count metrics |

### Admin Dashboard

| Feature | Description |
|---|---|
| Platform Metrics | Dashboard with product, category, order and user counts |
| User Management | List users, ban/unban accounts with confirmation |
| Category Management | Full CRUD on categories (create, edit, delete with form dialog) |

### Event-Driven Workflows (Kafka)

| Event | Producer | Consumer | Action |
|---|---|---|---|
| `order.placed` | Order Service | Inventory Service | Decrement stock |
| `payment.processed` | Payment Service | Order Service | Update order status to PAID |
| `order.shipped` | Seller Dashboard | Notification Service | Notify buyer |
| `stock.low` | Inventory Service | Notification Service | Alert seller |

---

## Testing Strategy

The project implements a **multi-layered testing pyramid** covering all quality aspects.

```
                    ┌──────────────┐
                    │  E2E / Perf  │  Cypress, JMeter, Gatling
                   ─┤              ├─
                  / └──────────────┘ \
                 /  ┌────────────────┐ \
                │   │  Functional    │   │  Cucumber (BDD)
                │  ─┤                ├─  │
               /  / └────────────────┘ \  \
              /  /  ┌──────────────────┐ \  \
             │  │   │  Integration     │   │  │  Testcontainers
             │  │  ─┤                  ├─  │  │
            /  /  / └──────────────────┘ \  \  \
           /  /  /  ┌────────────────────┐ \  \  \
          │  │  │   │  Unit Tests        │   │  │  │  JUnit, Mockito, Jasmine
          └──┴──┴───┤                    ├───┴──┴──┘
                    └────────────────────┘
```

| Level | Backend | Frontend | Execution |
|---|---|---|---|
| **Unit** | JUnit 5 + Mockito | Jasmine + Karma | `./mvnw test` / `ng test` |
| **Integration** | Testcontainers (PG, Kafka, Minio, Keycloak) | HttpClientTestingModule | `./mvnw verify -Pintegration-tests` |
| **Functional (BDD)** | Cucumber + Gherkin | - | `./mvnw verify -Pcucumber` |
| **E2E** | - | Cypress | `npx cypress run` |
| **Performance** | JMeter, Gatling | - | `jmeter -n -t ...` / `./mvnw gatling:test` |
| **Security (SAST)** | Checkmarx, SonarCloud | SonarCloud, ESLint | CI pipeline |
| **Security (DAST)** | OWASP ZAP | OWASP ZAP | `docker run zaproxy/zap-stable ...` |
| **Security (SCA)** | Trivy, OWASP Dep-Check, Snyk | npm audit, Snyk | CI pipeline |
| **Security (IaC)** | Checkov, Snyk IaC | - | `checkov -d infra/terraform/` |
| **Mutation** | PITest | - | `./mvnw pitest:mutationCoverage` |
| **Contract** | Spring Cloud Contract / Pact | Pact | `./mvnw verify -Pcontract-tests` |
| **Accessibility** | - | axe-core, Pa11y | `npx axe-core ...` |
| **Chaos** | Chaos Monkey for Spring Boot | - | Runtime |

For detailed testing instructions see [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md).

---

## Environments

| Env   | Profile        | Stack                                       | Purpose                          |
|-------|----------------|---------------------------------------------|----------------------------------|
| LOCAL | `local-docker` | Docker Compose                              | Developer workstation            |
| LOCAL | `local-k8s`    | Helm + Minikube                             | Local Kubernetes testing         |
| INT   | `azure-int`    | Packer + Terraform + Ansible + Azure VM     | Integration testing              |
| UAT   | `azure-uat`    | Terraform + Azure PaaS + Key Vault          | User acceptance testing          |
| OAT   | `azure-oat`    | Terraform + Helm + AKS + Key Vault          | Operational acceptance testing   |
| PRD   | `azure-prd`    | Terraform + Helm + AKS + Key Vault          | Production                       |

For full setup instructions, see [docs/deployment.md](docs/deployment.md).

---

## Quick Start

```bash
make all          # Start infra + backend + frontend (local-docker)
make stop         # Stop everything
make help         # Show all available targets
```

---

## Project Structure

```
mini-aliexpress/
│
├── backend/                              # Spring Boot 3.5 (Hexagonal Architecture)
│   ├── src/main/java/                    #   Application source code
│   ├── src/main/resources/
│   │   ├── application.yaml              #   Shared config (server, JPA, Liquibase, OpenAPI)
│   │   ├── application-local.yaml        #   Profile: LOCAL (Docker Compose)
│   │   ├── application-local-k8s.yaml    #   Profile: LOCAL (Minikube)
│   │   ├── application-azure-int.yaml    #   Profile: INT (Azure VM)
│   │   ├── application-azure-uat.yaml    #   Profile: UAT (Azure PaaS)
│   │   ├── application-azure-oat.yaml    #   Profile: OAT (Azure AKS, verbose logging)
│   │   ├── application-azure-prd.yaml    #   Profile: PRD (Azure AKS, production)
│   │   └── db/changelog/                 #   Liquibase migrations
│   ├── src/test/                         #   Tests (JUnit, Testcontainers, Cucumber)
│   ├── Dockerfile                        #   Multi-stage build (Maven + JRE Alpine)
│   ├── pom.xml
│   └── README.md                         #   Backend documentation
│
├── frontend/                             # Angular 18 (Standalone Components)
│   ├── src/app/                          #   Application source code
│   │   ├── core/                         #     Singleton services, guards, interceptors
│   │   │   ├── auth/                     #       Keycloak init, AuthKeycloakService, guards
│   │   │   ├── interceptors/             #       Auth (401/403) & error HTTP interceptors
│   │   │   └── services/                 #       NotificationService (MatSnackBar wrapper)
│   │   ├── shared/                       #     Reusable components, pipes, mappers
│   │   └── features/                     #     Lazy-loaded feature modules
│   │       ├── product/                  #       Product listing, detail, search
│   │       ├── admin/                    #       Admin: dashboard, user mgmt, category CRUD
│   │       └── ...
│   ├── Dockerfile                        #   Multi-stage build (Node + Nginx)
│   ├── angular.json
│   ├── package.json
│   └── README.md                         #   Frontend documentation
│
├── infra/                                # Infrastructure as Code
│   ├── docker/
│   │   └── local/                        #   LOCAL: Docker Compose
│   │       ├── docker-compose.yml
│   │       ├── .env
│   │       └── config/
│   │           ├── keycloak/             #     Realm export (auto-import)
│   │           └── postgres/             #     Init scripts
│   │
│   ├── packer/                           #   INT: VM image building
│   │   └── *.pkr.hcl                    #     Packer templates for Azure VM
│   │
│   ├── ansible/                          #   INT: Configuration management
│   │   ├── playbooks/                    #     Deployment playbooks
│   │   └── inventory/                    #     Environment inventories
│   │
│   ├── k8s/
│   │   ├── local/                        #   LOCAL: Minikube
│   │   │   ├── helm/mini-aliexpress/     #     Helm chart + Bitnami deps
│   │   │   └── scripts/                  #     setup-minikube.sh
│   │   │
│   │   └── azure-aks/                    #   OAT/PRD: AKS
│   │       ├── helm/mini-aliexpress/     #     Helm chart (prod values, HPA)
│   │       └── scripts/                  #     deploy-aks.sh
│   │
│   └── terraform/
│       ├── modules/                      #   Reusable Terraform modules
│       │   ├── aks/                      #     Azure Kubernetes Service
│       │   ├── postgresql/               #     Azure Database for PostgreSQL
│       │   ├── blob-storage/             #     Azure Blob Storage
│       │   ├── event-hubs/               #     Azure Event Hubs (Kafka replacement)
│       │   ├── keycloak-vm/              #     Keycloak on Azure VM
│       │   ├── networking/               #     VNet, subnets, DNS
│       │   └── container-registry/       #     Azure Container Registry
│       │
│       └── environments/
│           ├── azure-int/                #   INT: Terraform for Azure VM infra
│           ├── azure-uat/                #   UAT: Terraform for Azure PaaS infra
│           └── azure-prd/                #   OAT/PRD: Terraform for AKS infra
│
├── docs/                                 # Documentation
│   ├── architecture.md                   #   Architecture details & key concepts
│   ├── deployment.md                     #   Deployment profiles & Makefile reference
│   ├── api.md                            #   REST API documentation
│   ├── security.md                       #   OAuth2/Keycloak & security testing
│   └── adr/                              #   Architecture Decision Records
│       ├── README.md                     #     ADR index
│       ├── template.md                   #     ADR template
│       └── 001-hexagonal-architecture.md #     Hexagonal architecture decision
│
├── .run/                                 # IntelliJ IDEA Run Configurations
│   ├── All (Infra + Backend + Frontend).run.xml
│   ├── Backend (Local).run.xml           #   Spring Boot with debug support
│   ├── Frontend (ng serve).run.xml
│   ├── Infra (Docker Compose).run.xml
│   └── Backend Tests.run.xml
│
├── .github/
│   └── workflows/
│       └── ci.yml                        # GitHub Actions CI (build, test, SonarCloud)
│
├── sonar-project.properties              # SonarCloud monorepo config (backend + frontend modules)
├── Makefile                              # Project orchestration (make all / stop / test)
├── TODO.md                               # Project checklist
├── CONTRIBUTING.md                       # Gitflow, commit conventions, PR process
├── CHANGELOG.md                          # Release history
├── LICENSE.md                            # MIT license
├── .java-version                         # jenv — pins Java 17
├── .nvmrc                                # nvm — pins Node 22
├── .gitignore
└── README.md                             # This file
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/architecture.md](docs/architecture.md) | Hexagonal & Angular architecture, diagrams, key concepts |
| [docs/deployment.md](docs/deployment.md) | 5 environments (LOCAL, INT, UAT, OAT, PRD), prerequisites, Makefile reference |
| [docs/api.md](docs/api.md) | REST API endpoints, auth, response formats |
| [docs/security.md](docs/security.md) | OAuth2/Keycloak configuration, security testing tools |
| [docs/adr/](docs/adr/README.md) | Architecture Decision Records |
| [backend/README.md](backend/README.md) | Backend: running, config, testing, DB migrations |
| [frontend/README.md](frontend/README.md) | Frontend: running, testing, planned dependencies |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Gitflow, commit conventions, PR process, code style |
| [CHANGELOG.md](CHANGELOG.md) | Release history |

---

## Author

**Mohammed Jabrane**

## License

This project is licensed under the [MIT License](LICENSE.md).
