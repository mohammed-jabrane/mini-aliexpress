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
| TypeScript | 5.5 | Language |
| NgRx | - | Reactive state management (Store, Effects, Selectors) |
| Angular Signals | - | Fine-grained reactivity |
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
| SonarQube | - | Code quality, security hotspots, coverage |
| Checkmarx | - | SAST (static code analysis) |
| Checkov | - | Terraform IaC security scanning |

### Infrastructure & DevOps

| Technology | Purpose |
|---|---|
| Docker / Docker Compose | Local container orchestration |
| Kubernetes / Helm | Container orchestration (Minikube & AKS) |
| Terraform | Infrastructure as Code (Azure) |
| Minikube | Local Kubernetes cluster |
| Azure AKS | Managed Kubernetes on Azure |
| Azure PaaS | Blob Storage, Event Hubs, Flexible Server, App Service |
| Maven | Backend build & dependency management |
| Angular CLI | Frontend build tooling |
| Make | Project orchestration (Makefile) |

---

## Architecture

### Backend - Hexagonal Architecture (Ports & Adapters)

The backend follows hexagonal architecture to enforce a clean separation of concerns and keep the domain independent of external frameworks.

```
ma.mohammedjabrane.mini_aliexpress_backend
│
├── domain/                     # Core business logic (framework-agnostic)
│   ├── model/                  #   Domain entities & value objects
│   ├── port/
│   │   ├── in/                 #   Input ports (use-case interfaces)
│   │   └── out/                #   Output ports (repository / external service interfaces)
│   └── exception/              #   Domain-specific exceptions
│
├── application/                # Use-case implementations (orchestration)
│   ├── service/                #   Application services implementing input ports
│   ├── dto/                    #   Data Transfer Objects
│   └── mapper/                 #   DTO <-> Domain mappers
│
└── infrastructure/             # Adapters (technical details)
    ├── adapter/
    │   ├── in/
    │   │   └── web/            #   REST Controllers (driving adapters)
    │   └── out/
    │       ├── persistence/    #   JPA Repositories & entities (driven adapters)
    │       ├── messaging/      #   Kafka producers / consumers
    │       └── storage/        #   Minio S3 client
    └── config/                 #   Spring configuration
        ├── kafka/              #     Kafka configuration
        ├── security/           #     Keycloak / OAuth2 configuration
        └── storage/            #     Minio configuration
```

### Frontend - Feature-based Modular Architecture

```
src/app/
│
├── core/                       # Singleton services, guards, interceptors
│   ├── auth/                   #   Keycloak authentication
│   ├── interceptors/           #   HTTP interceptors (token, error handling)
│   └── guards/                 #   Route guards
│
├── shared/                     # Reusable components, pipes, directives
│   ├── components/             #   UI components (buttons, cards, modals)
│   ├── pipes/                  #   Custom pipes
│   └── mappers/                #   DTO <-> Model mappers
│
├── features/                   # Lazy-loaded feature modules
│   ├── product/                #   Product listing, detail, search
│   ├── cart/                   #   Shopping cart
│   ├── order/                  #   Order management
│   └── user/                   #   User profile
│
├── store/                      # NgRx global state
│   ├── product/                #   Actions, reducers, effects, selectors
│   ├── cart/
│   └── order/
│
├── app.config.ts               # Application providers
├── app.routes.ts               # Root routes with lazy loading
└── app.component.ts            # Root component
```

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

### Event-Driven Workflows (Kafka)

| Event | Producer | Consumer | Action |
|---|---|---|---|
| `order.placed` | Order Service | Inventory Service | Decrement stock |
| `payment.processed` | Payment Service | Order Service | Update order status to PAID |
| `order.shipped` | Seller Dashboard | Notification Service | Notify buyer |
| `stock.low` | Inventory Service | Notification Service | Alert seller |

---

## Testing Strategy

The project implements a **multi-layered testing pyramid** covering all quality aspects, from fast unit tests at the base to slow end-to-end tests at the top.

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

### 1. Unit Tests (Backend) — JUnit 5 + Mockito

Fast, isolated tests for domain logic & application services. No Spring context loaded.

| Layer | What is tested | Mocking strategy |
|---|---|---|
| Domain model | Entities, value objects, business rules | No mocks needed (pure logic) |
| Application services | Use-case orchestration | Mockito mocks for output ports |
| Mappers | DTO <-> Domain conversions | No mocks (pure mapping) |
| Controllers | Request/Response mapping | `@WebMvcTest` + MockMvc + `@MockBean` |

```bash
# Run backend unit tests
cd backend
./mvnw test
```

**Example structure:**
```
src/test/java/
├── domain/
│   └── model/
│       └── ProductTest.java                  # Pure domain logic
├── application/
│   └── service/
│       └── ProductServiceTest.java           # Mockito mocks for ports
└── infrastructure/
    └── adapter/in/web/
        └── ProductControllerTest.java        # @WebMvcTest + MockMvc
```

### 2. Unit Tests (Frontend) — Jasmine + Karma

Isolated tests for Angular components, services, NgRx reducers, effects, selectors, and mappers.

| Target | What is tested | Tools |
|---|---|---|
| Components | Rendering, user interactions, inputs/outputs | `TestBed`, `ComponentFixture` |
| Services | HTTP calls, business logic | `HttpClientTestingModule` |
| NgRx Reducers | State transitions | Direct function calls |
| NgRx Effects | Side effects, API calls | `provideMockActions`, `jasmine-marbles` |
| NgRx Selectors | Memoized state queries | `projector()` method |
| Mappers | DTO <-> Model transformations | Direct function calls |
| Pipes | Value formatting | Direct instantiation |

```bash
# Run frontend unit tests
cd frontend
ng test                    # Watch mode
ng test --no-watch --code-coverage   # CI mode with coverage
```

### 3. Integration Tests — Testcontainers

Test real infrastructure interactions using disposable Docker containers. No mocks for external systems.

| Container | What is tested |
|---|---|
| `PostgreSQLContainer` | JPA repositories, Liquibase migrations, complex queries |
| `KafkaContainer` | Kafka producer/consumer, event serialization, topic creation |
| `MinIOContainer` | S3 file upload/download, bucket operations |
| `KeycloakContainer` | OAuth2 token validation, role-based access control |

```bash
# Run integration tests (requires Docker running)
cd backend
./mvnw verify -Pintegration-tests
```

**Example structure:**
```
src/test/java/
└── infrastructure/
    └── adapter/out/
        ├── persistence/
        │   └── ProductRepositoryIT.java      # @Testcontainers + PostgreSQL
        ├── messaging/
        │   └── OrderEventProducerIT.java     # @Testcontainers + Kafka
        └── storage/
            └── ImageStorageAdapterIT.java    # @Testcontainers + MinIO
```

**Example Testcontainers setup:**
```java
@Testcontainers
@SpringBootTest
class ProductRepositoryIT {

    @Container
    static PostgreSQLContainer<?> postgres =
        new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("test_db");

    @Container
    static KafkaContainer kafka =
        new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.6.0"));

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
    }
}
```

### 4. Functional Tests (BDD) — Cucumber

Behavior-driven tests written in Gherkin (`Given / When / Then`) to validate business scenarios end-to-end.

| Feature file | Scenario examples |
|---|---|
| `product-catalog.feature` | Search products, filter by category, view detail |
| `shopping-cart.feature` | Add to cart, update quantity, remove item |
| `checkout.feature` | Place order, validate stock, payment flow |
| `user-auth.feature` | Register, login, role-based access |
| `seller-dashboard.feature` | Create product, manage inventory, fulfill order |

```bash
# Run Cucumber tests
cd backend
./mvnw verify -Pcucumber
```

**Example structure:**
```
src/test/resources/features/
├── product-catalog.feature
├── shopping-cart.feature
├── checkout.feature
└── user-auth.feature

src/test/java/cucumber/
├── CucumberRunnerIT.java           # @Suite + @ConfigurationParameter
├── steps/
│   ├── ProductSteps.java
│   ├── CartSteps.java
│   └── OrderSteps.java
└── config/
    └── CucumberSpringConfig.java   # @CucumberContextConfiguration
```

**Example Gherkin:**
```gherkin
Feature: Shopping Cart

  Scenario: Add a product to the cart
    Given I am logged in as "user"
    And the product "Wireless Mouse" exists with price 25.99
    When I add "Wireless Mouse" to my cart with quantity 2
    Then my cart should contain 1 item
    And the cart total should be 51.98

  Scenario: Stock validation on checkout
    Given I am logged in as "user"
    And the product "USB Cable" has 3 items in stock
    And my cart contains "USB Cable" with quantity 5
    When I proceed to checkout
    Then I should see an error "Insufficient stock for USB Cable"
```

### 5. Performance Tests — JMeter + Gatling

Load and stress tests to validate API throughput, response times, and system behavior under pressure.

| Tool | Purpose | Scenarios |
|---|---|---|
| **Apache JMeter** | Load testing, stress testing, endurance testing | Product search, checkout flow, concurrent users |
| **Gatling** | High-performance load simulation (code-based) | API endpoint stress, WebSocket, ramp-up patterns |

```bash
# Run JMeter tests (headless)
jmeter -n -t tests/performance/jmeter/product-search.jmx -l results.jtl -e -o report/

# Run Gatling simulations
cd backend
./mvnw gatling:test
```

**Test plan structure:**
```
tests/performance/
├── jmeter/
│   ├── product-search.jmx          # Product search load test
│   ├── checkout-flow.jmx           # Full checkout scenario
│   ├── concurrent-users.jmx        # Ramp-up to 500 concurrent users
│   └── data/
│       ├── users.csv               # Test user credentials
│       └── products.csv            # Product IDs for search
│
└── gatling/
    └── simulations/
        ├── ProductSearchSimulation.scala
        └── CheckoutSimulation.scala
```

**Performance targets:**

| Metric | Target |
|---|---|
| Average response time (GET /products) | < 200 ms |
| 95th percentile (GET /products/{id}) | < 500 ms |
| Throughput (checkout flow) | > 50 req/s |
| Error rate under load | < 1% |
| System stability (1h endurance) | No memory leaks, no degradation |

### 6. Security Tests

Multi-layer security scanning to detect vulnerabilities across code, dependencies, containers, and runtime.

| Tool | Type | What it scans |
|---|---|---|
| **Trivy** | Container & dependency scanner | Docker images, OS packages, Java/npm dependencies (CVEs) |
| **Checkmarx (SAST)** | Static Application Security Testing | Source code for injection flaws, XSS, insecure patterns |
| **OWASP ZAP** | Dynamic Application Security Testing (DAST) | Running application for OWASP Top 10 vulnerabilities |
| **OWASP Dependency-Check** | Software Composition Analysis (SCA) | Maven & npm dependencies for known CVEs |
| **SonarQube** | Code quality & security | Bugs, code smells, security hotspots, coverage |
| **Snyk** | Open source vulnerability scanner | Dependencies, container images, IaC (Terraform) |
| **Checkov** | Infrastructure as Code security | Terraform misconfigurations, compliance violations |

```bash
# ── Container scanning with Trivy ────────────────────────────
trivy image mini-aliexpress-backend:latest
trivy image frontend:latest
trivy fs --security-checks vuln,config .

# ── OWASP Dependency-Check (Maven) ───────────────────────────
cd backend
./mvnw org.owasp:dependency-check-maven:check

# ── OWASP Dependency-Check (npm) ─────────────────────────────
cd frontend
npm audit

# ── OWASP ZAP (DAST) ─────────────────────────────────────────
docker run --rm -t zaproxy/zap-stable zap-baseline.py \
  -t http://localhost:8080 -r zap-report.html

# ── SonarQube analysis ───────────────────────────────────────
cd backend
./mvnw sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=<SONAR_TOKEN>

# ── Checkov (Terraform IaC) ──────────────────────────────────
checkov -d infra/terraform/

# ── Snyk ─────────────────────────────────────────────────────
snyk test --all-projects
snyk container test mini-aliexpress-backend:latest
snyk iac test infra/terraform/
```

### 7. Other Quality Tests

| Test type | Tool | Purpose |
|---|---|---|
| **API Contract Testing** | Spring Cloud Contract / Pact | Verify API contracts between frontend and backend |
| **Mutation Testing** | PITest (backend) | Validate test effectiveness by injecting code mutations |
| **Accessibility Testing** | axe-core / Pa11y | WCAG compliance for Angular UI |
| **Visual Regression** | Cypress + Percy | Detect unintended UI changes |
| **Chaos Engineering** | Chaos Monkey for Spring Boot | Test resilience (kill services, inject latency) |
| **Linting & Formatting** | ESLint, Prettier, Checkstyle | Code consistency enforcement |

```bash
# ── Mutation testing (PITest) ─────────────────────────────────
cd backend
./mvnw org.pitest:pitest-maven:mutationCoverage

# ── API contract testing ─────────────────────────────────────
cd backend
./mvnw verify -Pcontract-tests

# ── Accessibility audit ──────────────────────────────────────
npx axe-core http://localhost:4200

# ── Frontend linting ─────────────────────────────────────────
cd frontend
ng lint
```

### Testing Summary

| Level | Backend | Frontend | Execution |
|---|---|---|---|
| **Unit** | JUnit 5 + Mockito | Jasmine + Karma | `./mvnw test` / `ng test` |
| **Integration** | Testcontainers (PG, Kafka, Minio, Keycloak) | HttpClientTestingModule | `./mvnw verify -Pintegration-tests` |
| **Functional (BDD)** | Cucumber + Gherkin | - | `./mvnw verify -Pcucumber` |
| **E2E** | - | Cypress | `npx cypress run` |
| **Performance** | JMeter, Gatling | - | `jmeter -n -t ...` / `./mvnw gatling:test` |
| **Security (SAST)** | Checkmarx, SonarQube | SonarQube, ESLint | CI pipeline |
| **Security (DAST)** | OWASP ZAP | OWASP ZAP | `docker run zaproxy/zap-stable ...` |
| **Security (SCA)** | Trivy, OWASP Dep-Check, Snyk | npm audit, Snyk | CI pipeline |
| **Security (IaC)** | Checkov, Snyk IaC | - | `checkov -d infra/terraform/` |
| **Mutation** | PITest | - | `./mvnw pitest:mutationCoverage` |
| **Contract** | Spring Cloud Contract / Pact | Pact | `./mvnw verify -Pcontract-tests` |
| **Accessibility** | - | axe-core, Pa11y | `npx axe-core ...` |
| **Chaos** | Chaos Monkey for Spring Boot | - | Runtime |

---

## Deployment Profiles

The project supports **4 deployment profiles**, each with its own infrastructure setup:

| # | Profile | Description | Infra Tool |
|---|---|---|---|
| 1 | **local** | Docker Compose on your machine | Docker Compose |
| 2 | **local-k8s** | Minikube cluster with Helm charts | Helm + Minikube |
| 3 | **azure-aks** | Full AKS cluster on Azure | Terraform + Helm |
| 4 | **azure-services** | Azure PaaS services (no Kubernetes) | Terraform |

### Service mapping across profiles

| Service | local | local-k8s | azure-aks | azure-services |
|---|---|---|---|---|
| Database | PostgreSQL (container) | PostgreSQL (Helm) | PostgreSQL (Helm) | Azure Database for PostgreSQL |
| Messaging | Kafka + Schema Registry | Kafka (Helm) | Kafka (Helm) | Azure Event Hubs |
| Object Storage | Minio S3 | Minio (Helm) | Minio (Helm) | Azure Blob Storage |
| Identity | Keycloak (container) | Keycloak (Helm) | Keycloak (Helm) | Keycloak (Azure VM) |
| Backend | Spring Boot (local JVM) | K8s Deployment | K8s Deployment | Azure App Service |
| Frontend | Angular dev server | K8s Deployment | K8s Deployment | Azure Static Web App |
| Container Registry | - | Minikube local | Azure ACR | Azure ACR |
| Ingress | - | NGINX Ingress | NGINX Ingress | Azure managed |

---

## Prerequisites

- **Java** 17+
- **Node.js** 18+ and **npm**
- **Docker** & **Docker Compose**
- **Maven** 3.9+ (or use the included `mvnw` wrapper)
- **Angular CLI** 18 (`npm install -g @angular/cli`)

Additional for specific profiles:

| Profile | Extra prerequisites |
|---|---|
| local-k8s | Minikube, kubectl, Helm 3 |
| azure-aks | Azure CLI, Terraform >= 1.5, kubectl, Helm 3 |
| azure-services | Azure CLI, Terraform >= 1.5 |

---

## Getting Started

### Option A — One command (Makefile)

```bash
make all          # Start infra + backend + frontend
make stop         # Stop everything
make help         # Show all available targets
```

### Option B — IntelliJ IDEA (with debug)

The project includes shared IntelliJ Run Configurations (`.run/` directory). Open the project in IntelliJ and select from the **Run** dropdown:

| Configuration | Type | Action |
|---|---|---|
| **All (Infra + Backend + Frontend)** | Compound | Launches everything in one click |
| **Infra (Docker Compose)** | Docker | Starts PostgreSQL, Kafka, Minio, Keycloak |
| **Backend (Local)** | Spring Boot | Runs backend with `local` profile (supports breakpoints) |
| **Frontend (ng serve)** | npm | Starts Angular dev server |
| **Backend Tests** | JUnit | Runs all backend tests |

To **debug the backend**: select `Backend (Local)` and click the **Debug** button. Set breakpoints anywhere in the code.

### Option C — Manual (step by step)

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

| Service | URL | Credentials |
|---|---|---|
| Backend API | http://localhost:8080/api | - |
| Swagger UI | http://localhost:8080/api/swagger-ui.html | - |
| Frontend | http://localhost:4200 | - |
| PostgreSQL | localhost:5432 | `aliexpress` / `aliexpress_secret` |
| Kafka | localhost:9092 | - |
| Schema Registry | http://localhost:8081 | - |
| Kafka UI | http://localhost:9090 | - |
| Minio Console | http://localhost:9001 | `minioadmin` / `minioadmin` |
| Keycloak Admin | http://localhost:8180 | `admin` / `admin` |

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

## Project Structure

```
mini-aliexpress/
│
├── backend/                              # Spring Boot 3.5 (Hexagonal Architecture)
│   ├── src/main/java/                    #   Application source code
│   ├── src/main/resources/
│   │   ├── application.yaml              #   Shared config (server, JPA, Liquibase, OpenAPI)
│   │   ├── application-local.yaml        #   Profile: local Docker Compose
│   │   ├── application-local-k8s.yaml    #   Profile: Minikube
│   │   ├── application-azure-aks.yaml    #   Profile: Azure AKS
│   │   ├── application-azure-services.yaml #  Profile: Azure PaaS
│   │   └── db/changelog/                 #   Liquibase migrations
│   ├── src/test/                         #   Tests (JUnit, Testcontainers, Cucumber)
│   ├── Dockerfile                        #   Multi-stage build (Maven + JRE Alpine)
│   └── pom.xml
│
├── frontend/                             # Angular 18 (Standalone Components)
│   ├── src/app/                          #   Application source code
│   ├── Dockerfile                        #   Multi-stage build (Node + Nginx)
│   ├── angular.json
│   └── package.json
│
├── infra/                                # Infrastructure as Code
│   ├── docker/
│   │   └── local/                        #   Profile 1: Docker Compose
│   │       ├── docker-compose.yml
│   │       ├── .env
│   │       └── config/
│   │           ├── keycloak/             #     Realm export (auto-import)
│   │           └── postgres/             #     Init scripts
│   │
│   ├── k8s/
│   │   ├── local/                        #   Profile 2: Minikube
│   │   │   ├── helm/mini-aliexpress/     #     Helm chart + Bitnami deps
│   │   │   └── scripts/                  #     setup-minikube.sh
│   │   │
│   │   └── azure-aks/                    #   Profile 3: AKS
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
│           ├── azure-aks/                #   Profile 3: Terraform for AKS infra
│           └── azure-services/           #   Profile 4: Terraform for PaaS infra
│
├── .run/                                 # IntelliJ IDEA Run Configurations
│   ├── All (Infra + Backend + Frontend).run.xml
│   ├── Backend (Local).run.xml           #   Spring Boot with debug support
│   ├── Frontend (ng serve).run.xml
│   ├── Infra (Docker Compose).run.xml
│   └── Backend Tests.run.xml
│
├── Makefile                              # Project orchestration (make all / stop / test)
├── TODO.md                               # Project checklist
├── .gitignore
└── README.md                             # This file
```

---

## Key Concepts

### Hexagonal Architecture (Backend)

- **Domain layer** contains pure business logic with no framework dependencies
- **Input ports** define what the application can do (use cases)
- **Output ports** define what the application needs (repositories, external services)
- **Adapters** implement the ports: REST controllers (in), JPA repositories (out), Kafka consumers/producers (out), Minio client (out)

### Reactive State Management (Frontend)

- **NgRx Store** manages global application state (products, cart, orders)
- **Effects** handle side effects (API calls, navigation)
- **Selectors** provide memoized state queries
- **Signals** provide fine-grained reactivity for local component state
- **Mappers** transform API DTOs into frontend domain models

### Event-Driven Communication

- **Kafka** (local / K8s) or **Azure Event Hubs** (PaaS) handles asynchronous events between bounded contexts (order placed, payment processed, stock updated)

### Security

- **Keycloak** provides OAuth2/OIDC authentication and role-based authorization
- Angular frontend integrates via `keycloak-angular` adapter
- Backend validates JWT tokens via Spring Security resource server

### Infrastructure as Code

- **Terraform modules** are reusable across profiles — DRY principle
- **Helm charts** are parameterized per environment (local vs. AKS)
- **Docker Compose** provides the simplest local development experience

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

---

## API Documentation

Once the backend is running, interactive API documentation is available via Swagger UI:

```
http://localhost:8080/api/swagger-ui.html
```

---

## Database Migrations

Database schema changes are managed with **Liquibase**. Changelogs are located in:

```
backend/src/main/resources/db/changelog/
```

Migrations run automatically on application startup.

---

## Git Branching Strategy (Gitflow)

The project follows the **Gitflow** branching model to organize development, releases, and hotfixes.

```
main ─────●────────────────────────●──────────────●──── (production-ready)
           \                      / \            /
            \     release/1.0 ───●   \          /
             \   /                    \        /
develop ──────●────●────●────●─────────●──────●────── (integration)
               \      / \      /
    feature/    ●────●   ●────●
    product-crud      cart-management
```

### Branch Types

| Branch | From | Merges into | Purpose |
|---|---|---|---|
| `main` | - | - | Production-ready code. Every commit is a release. |
| `develop` | `main` | - | Integration branch. All features merge here first. |
| `feature/*` | `develop` | `develop` | New feature development (e.g., `feature/product-crud`, `feature/cart-management`) |
| `release/*` | `develop` | `main` + `develop` | Release preparation, version bump, last-minute fixes (e.g., `release/1.0.0`) |
| `hotfix/*` | `main` | `main` + `develop` | Critical production bug fixes (e.g., `hotfix/fix-checkout-crash`) |
| `bugfix/*` | `develop` | `develop` | Non-critical bug fixes during development |

### Naming Conventions

```
feature/product-crud
feature/cart-management
feature/order-checkout
feature/keycloak-auth
feature/kafka-events
feature/seller-dashboard
bugfix/fix-cart-total-calculation
release/1.0.0
hotfix/fix-payment-timeout
```

### Workflow

1. **Start a feature** — branch from `develop`
   ```bash
   git checkout develop
   git checkout -b feature/product-crud
   ```

2. **Work on the feature** — commit frequently with clear messages
   ```bash
   git add .
   git commit -m "feat(product): add product CRUD endpoints"
   ```

3. **Finish a feature** — merge back into `develop` via Pull Request
   ```bash
   git checkout develop
   git merge --no-ff feature/product-crud
   git branch -d feature/product-crud
   ```

4. **Prepare a release** — branch from `develop`, bump version, final fixes
   ```bash
   git checkout develop
   git checkout -b release/1.0.0
   # bump version, final testing
   git checkout main && git merge --no-ff release/1.0.0
   git tag -a v1.0.0 -m "Release 1.0.0"
   git checkout develop && git merge --no-ff release/1.0.0
   git branch -d release/1.0.0
   ```

5. **Hotfix** — branch from `main`, fix, merge into both `main` and `develop`
   ```bash
   git checkout main
   git checkout -b hotfix/fix-payment-timeout
   # fix the issue
   git checkout main && git merge --no-ff hotfix/fix-payment-timeout
   git tag -a v1.0.1 -m "Hotfix 1.0.1"
   git checkout develop && git merge --no-ff hotfix/fix-payment-timeout
   git branch -d hotfix/fix-payment-timeout
   ```

### Commit Message Convention

The project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]
```

| Type | Usage |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code restructuring (no behavior change) |
| `test` | Adding or updating tests |
| `chore` | Build, CI, config changes |
| `perf` | Performance improvement |
| `style` | Formatting, no logic change |

**Examples:**
```
feat(product): add product search with pagination
fix(cart): correct total calculation with discounts
test(order): add Testcontainers integration tests for OrderRepository
chore(infra): add Kafka and Minio to Docker Compose
docs: update README with Gitflow branching strategy
```

---

## Author

**Mohammed Jabrane**

---

## License

This project is developed for educational purposes as part of a university mini-project (TP).
