# Mini AliExpress — Project Checklist

## 1. Project Setup (FA01)

- [x] Initialize root Git repository
- [x] Create `.gitignore` (root level)
- [x] Define branching strategy (main, develop, feature/*)

### Backend Setup (FA02)

- [x] Verify `pom.xml` dependencies (Spring Boot 3.5, JPA, Web, Lombok, Liquibase, OpenAPI)
- [x] Add Kafka dependency (`spring-kafka`)
- [x] Add Minio dependency (`minio` Java SDK)
- [x] Add Keycloak / Spring Security OAuth2 Resource Server dependency
- [x] Add Testcontainers dependencies (scope test)
- [x] Add Cucumber dependencies (scope test)
- [x] Add PITest Maven plugin
- [x] Add Gatling Maven plugin
- [x] Add OWASP Dependency-Check Maven plugin
- [x] Add SonarQube Maven plugin
- [x] Configure `application.yaml` per profile (`local`, `local-k8s`, `azure-aks`, `azure-services`)
- [x] Create `application-local.yaml`
- [x] Create `application-local-k8s.yaml`
- [x] Create `application-azure-aks.yaml`
- [x] Create `application-azure-services.yaml`
- [x] Create Dockerfile (multi-stage build)
- [x] Add plugin for run local (docker-compose, frontend, backend)
- [x] Add configuration for IntelliJ mode for run all

### Upgrade .md structure for more details (FA04)

- [x] Create a new structure of .md based on best practice

### Frontend Setup (FA03)

- [x] Install NgRx (`@ngrx/store`, `@ngrx/effects`, `@ngrx/store-devtools`, `@ngrx/entity`)
- [x] Install `keycloak-angular` + `keycloak-js`
- [x] Install Cypress (`cypress`)
- [x] Configure `HttpClient` provider in `app.config.ts`
- [x] Configure NgRx providers in `app.config.ts`
- [x] Configure Keycloak initialization (APP_INITIALIZER)
- [x] Configure environment files (`environment.ts`, `environment.local-k8s.ts`, `environment.azure.ts`)
- [x] Create Dockerfile (nginx + Angular build)
- [x] Configure proxy (`proxy.conf.json`) for local dev

---

## 2. Backend — Hexagonal Architecture

### Liquibase Migrations (FA05)

- [x] Create `db/changelog/db.changelog-master.yaml`
- [x] Create changeset: `001-create-category-table`
- [x] Create changeset: `002-create-product-table`
- [x] Create changeset: `003-create-cart-tables`
- [x] Create changeset: `004-create-order-tables`
- [x] Create changeset: `005-create-address-table`
- [x] Create changeset: `006-seed-categories`
- [x] Create changeset: `007-seed-sample-products`

### Create API Process for Product (FA06)
- [ ] Create package `domain.model`
- [ ] Create entity `Product` (id, name, description, price, stock, category, sellerId, images, createdAt, updatedAt)
- [ ] Create entity `Category` (id, name, parentId)

- [ ] Create package `domain.port.in` (input ports / use cases)
- [ ] Create `CreateProductUseCase`
- [ ] Create `SearchProductsUseCase`
- [ ] Create `GetProductByIdUseCase`
- [ ] Create `UpdateProductUseCase`
- [ ] Create `DeleteProductUseCase`

- [ ] Create package `domain.port.out` (output ports)
- [ ] Create `ProductRepositoryPort`
- [ ] Create `CategoryRepositoryPort`

- [ ] Create package `domain.exception`
- [ ] Create `ProductNotFoundException`

- [ ] Create package `application.service`
- [ ] Implement `ProductService` (implements product use cases)

- [ ] Create package `application.dto`
- [ ] Create `ProductRequestDTO` / `ProductResponseDTO`
- [ ] Create `CategoryDTO`

- [ ] Create package `application.mapper`
- [ ] Create `ProductMapper` (DTO <-> Domain)

- [ ] Create package `infrastructure.adapter.in.web`
- [ ] Create `ProductController` (REST CRUD + search)
- [ ] Create `CategoryController` (list, tree)

- [ ] Create package `infrastructure.adapter.out.persistence`
- [ ] Create `ProductJpaEntity` + `ProductJpaRepository`
- [ ] Create `CategoryJpaEntity` + `CategoryJpaRepository`

### Domain Layer

- [ ] Create entity `Cart` (id, userId, items, createdAt)
- [ ] Create entity `CartItem` (productId, quantity, unitPrice)
- [ ] Create entity `Order` (id, userId, items, status, totalAmount, shippingAddress, createdAt)
- [ ] Create entity `OrderItem` (productId, productName, quantity, unitPrice)
- [ ] Create enum `OrderStatus` (PENDING, PAID, SHIPPED, DELIVERED, CANCELLED)
- [ ] Create entity `User` (id, username, email, firstName, lastName, role)
- [ ] Create entity `Address` (id, userId, street, city, zipCode, country)
- [ ] Create value objects where appropriate (Money, ProductId, etc.)

- [ ] Create `AddToCartUseCase`
- [ ] Create `UpdateCartItemUseCase`
- [ ] Create `RemoveFromCartUseCase`
- [ ] Create `GetCartUseCase`
- [ ] Create `PlaceOrderUseCase`
- [ ] Create `GetOrderByIdUseCase`
- [ ] Create `ListOrdersUseCase`
- [ ] Create `UpdateOrderStatusUseCase`
- [ ] Create `UploadImageUseCase`

- [ ] Create `CartRepositoryPort`
- [ ] Create `OrderRepositoryPort`
- [ ] Create `ImageStoragePort`
- [ ] Create `OrderEventPublisherPort`

- [ ] Create `InsufficientStockException`
- [ ] Create `OrderNotFoundException`
- [ ] Create `UnauthorizedAccessException`

### Application Layer

- [ ] Implement `CartService` (implements cart use cases)
- [ ] Implement `OrderService` (implements order use cases)
- [ ] Implement `ImageService` (implements image use case)

- [ ] Create `CartDTO` / `CartItemDTO`
- [ ] Create `OrderRequestDTO` / `OrderResponseDTO`
- [ ] Create `AddressDTO`
- [ ] Create `PageResponseDTO<T>` (pagination wrapper)

- [ ] Create `CartMapper`
- [ ] Create `OrderMapper`
- [ ] Create `AddressMapper`

### Infrastructure Layer — Adapters IN (Web)

- [ ] Create `CartController` (get, add, update, remove)
- [ ] Create `OrderController` (place, get, list, update status)
- [ ] Create `ImageController` (upload endpoint)
- [ ] Create `GlobalExceptionHandler` (`@RestControllerAdvice`)

### Infrastructure Layer — Adapters OUT (Persistence)

- [ ] Create `CartJpaEntity` / `CartItemJpaEntity` + `CartJpaRepository`
- [ ] Create `OrderJpaEntity` / `OrderItemJpaEntity` + `OrderJpaRepository`
- [ ] Create `ProductPersistenceAdapter` (implements `ProductRepositoryPort`)
- [ ] Create `CartPersistenceAdapter` (implements `CartRepositoryPort`)
- [ ] Create `OrderPersistenceAdapter` (implements `OrderRepositoryPort`)
- [ ] Create JPA entity <-> Domain model mappers

### Infrastructure Layer — Adapters OUT (Messaging)

- [ ] Create package `infrastructure.adapter.out.messaging`
- [ ] Create `OrderEventKafkaPublisher` (implements `OrderEventPublisherPort`)
- [ ] Create `OrderEventConsumer` (`@KafkaListener`)
- [ ] Create `StockEventConsumer` (`@KafkaListener`)
- [ ] Define Kafka topics (order-events, product-events, payment-events, stock-events)
- [ ] Create event DTOs (`OrderPlacedEvent`, `PaymentProcessedEvent`, `StockLowEvent`)

### Infrastructure Layer — Adapters OUT (Storage)

- [ ] Create package `infrastructure.adapter.out.storage`
- [ ] Create `MinioImageStorageAdapter` (implements `ImageStoragePort`)
- [ ] Create `AzureBlobImageStorageAdapter` (implements `ImageStoragePort` for azure-services profile)

### Infrastructure Layer — Configuration

- [ ] Create `infrastructure.config.kafka.KafkaConfig`
- [ ] Create `infrastructure.config.kafka.KafkaTopicConfig`
- [ ] Create `infrastructure.config.security.SecurityConfig` (Spring Security + Keycloak JWT)
- [ ] Create `infrastructure.config.security.JwtAuthConverter`
- [ ] Create `infrastructure.config.storage.MinioConfig`
- [ ] Create `infrastructure.config.storage.AzureBlobConfig`
- [ ] Create `infrastructure.config.OpenApiConfig` (Swagger customization)
- [ ] Create CORS configuration

---

## 3. Frontend — Angular 18

### Core Module

- [ ] Create `core/auth/keycloak.service.ts`
- [ ] Create `core/auth/auth.guard.ts`
- [ ] Create `core/auth/role.guard.ts`
- [ ] Create `core/interceptors/auth.interceptor.ts` (attach JWT token)
- [ ] Create `core/interceptors/error.interceptor.ts` (global error handling)
- [ ] Create `core/services/notification.service.ts` (toast messages)

### Shared Module

- [ ] Create `shared/components/header/` (navbar, search bar, cart icon, user menu)
- [ ] Create `shared/components/footer/`
- [ ] Create `shared/components/product-card/` (reusable card component)
- [ ] Create `shared/components/pagination/`
- [ ] Create `shared/components/loading-spinner/`
- [ ] Create `shared/components/confirm-dialog/`
- [ ] Create `shared/pipes/currency-format.pipe.ts`
- [ ] Create `shared/pipes/truncate.pipe.ts`
- [ ] Create `shared/mappers/product.mapper.ts`
- [ ] Create `shared/mappers/cart.mapper.ts`
- [ ] Create `shared/mappers/order.mapper.ts`
- [ ] Create `shared/models/` (frontend domain models)

### Feature — Product

- [ ] Create `features/product/product.routes.ts` (lazy-loaded)
- [ ] Create `features/product/pages/product-list/` (grid, filters, sorting, pagination)
- [ ] Create `features/product/pages/product-detail/` (images gallery, add to cart, seller info)
- [ ] Create `features/product/pages/product-search/` (search results)
- [ ] Create `features/product/services/product.service.ts`
- [ ] Implement product Signals for local component state

### Feature — Cart

- [ ] Create `features/cart/cart.routes.ts` (lazy-loaded)
- [ ] Create `features/cart/pages/cart-page/` (item list, quantities, totals, checkout button)
- [ ] Create `features/cart/components/cart-item/`
- [ ] Create `features/cart/components/cart-summary/`
- [ ] Create `features/cart/services/cart.service.ts`

### Feature — Order

- [ ] Create `features/order/order.routes.ts` (lazy-loaded)
- [ ] Create `features/order/pages/checkout/` (address, payment, review, confirm)
- [ ] Create `features/order/pages/order-detail/` (status timeline)
- [ ] Create `features/order/pages/order-history/` (list with filters)
- [ ] Create `features/order/services/order.service.ts`

### Feature — User

- [ ] Create `features/user/user.routes.ts` (lazy-loaded)
- [ ] Create `features/user/pages/profile/` (edit profile, avatar upload)
- [ ] Create `features/user/pages/addresses/` (CRUD addresses)
- [ ] Create `features/user/services/user.service.ts`

### Feature — Seller Dashboard

- [ ] Create `features/seller/seller.routes.ts` (lazy-loaded, role-guarded)
- [ ] Create `features/seller/pages/product-management/` (CRUD table)
- [ ] Create `features/seller/pages/product-form/` (create/edit with image upload)
- [ ] Create `features/seller/pages/inventory/` (stock levels)
- [ ] Create `features/seller/pages/orders/` (incoming orders, update status)
- [ ] Create `features/seller/services/seller.service.ts`

### Feature — Admin (optional)

- [ ] Create `features/admin/admin.routes.ts` (lazy-loaded, role-guarded)
- [ ] Create `features/admin/pages/dashboard/` (platform metrics)
- [ ] Create `features/admin/pages/user-management/` (list, ban)
- [ ] Create `features/admin/pages/category-management/` (CRUD categories)

### NgRx Store

- [ ] Create `store/product/product.actions.ts`
- [ ] Create `store/product/product.reducer.ts`
- [ ] Create `store/product/product.effects.ts`
- [ ] Create `store/product/product.selectors.ts`
- [ ] Create `store/cart/cart.actions.ts`
- [ ] Create `store/cart/cart.reducer.ts`
- [ ] Create `store/cart/cart.effects.ts`
- [ ] Create `store/cart/cart.selectors.ts`
- [ ] Create `store/order/order.actions.ts`
- [ ] Create `store/order/order.reducer.ts`
- [ ] Create `store/order/order.effects.ts`
- [ ] Create `store/order/order.selectors.ts`
- [ ] Create `store/auth/auth.actions.ts`
- [ ] Create `store/auth/auth.reducer.ts`
- [ ] Create `store/auth/auth.selectors.ts`

### Routing (app.routes.ts)

- [ ] Configure lazy-loaded route for `/products`
- [ ] Configure lazy-loaded route for `/cart`
- [ ] Configure lazy-loaded route for `/orders`
- [ ] Configure lazy-loaded route for `/user`
- [ ] Configure lazy-loaded route for `/seller` (with `RoleGuard ROLE_SELLER`)
- [ ] Configure lazy-loaded route for `/admin` (with `RoleGuard ROLE_ADMIN`)
- [ ] Configure wildcard redirect to `/products`

---

## 4. Infrastructure

### Profile 1 — Local (Docker Compose)

- [x] Create `infra/docker/local/docker-compose.yml`
- [x] Create `.env` file
- [x] Create `config/postgres/init.sql`
- [x] Create `config/keycloak/realm-export.json`
- [ ] Test `docker compose up -d` — all services healthy
- [ ] Verify Keycloak realm auto-import
- [ ] Verify Minio buckets auto-created
- [ ] Verify Kafka UI accessible

### Profile 2 — Local Kubernetes (Minikube)

- [x] Create Helm chart (`Chart.yaml`, `values.yaml`)
- [x] Create K8s templates (Deployments, Services, Ingress)
- [x] Create `setup-minikube.sh` script
- [ ] Test Minikube deployment end-to-end
- [ ] Verify Ingress routing (`/api` -> backend, `/` -> frontend)
- [ ] Verify Bitnami sub-charts deploy correctly

### Profile 3 — Azure AKS

- [x] Create AKS Helm chart with HPA + TLS
- [x] Create `deploy-aks.sh` script
- [x] Create Terraform environment (`azure-aks/`)
- [ ] Test `terraform plan` — no errors
- [ ] Test `terraform apply` — AKS cluster created
- [ ] Test Helm deployment on AKS
- [ ] Verify ACR pull from AKS works
- [ ] Verify HPA autoscaling triggers

### Profile 4 — Azure Services (PaaS)

- [x] Create Terraform environment (`azure-services/`)
- [ ] Test `terraform plan` — no errors
- [ ] Test `terraform apply` — all services provisioned
- [ ] Verify App Service backend starts
- [ ] Verify Static Web App frontend deploys
- [ ] Verify Keycloak VM accessible
- [ ] Verify Event Hubs connectivity from backend

### Terraform Modules

- [x] Module `networking` (VNet, subnets, DNS)
- [x] Module `aks` (AKS cluster, RBAC, ACR pull)
- [x] Module `postgresql` (Flexible Server + databases)
- [x] Module `blob-storage` (Storage account + containers)
- [x] Module `event-hubs` (Namespace + topics)
- [x] Module `container-registry` (ACR)
- [x] Module `keycloak-vm` (Linux VM + cloud-init)

---

## 5. Testing

### Unit Tests — Backend (JUnit 5 + Mockito)

- [ ] Test `Product` domain model (validation, business rules)
- [ ] Test `Order` domain model (status transitions)
- [ ] Test `Cart` domain model (add/update/remove items, total calculation)
- [ ] Test `ProductService` (mock `ProductRepositoryPort`)
- [ ] Test `CartService` (mock `CartRepositoryPort`)
- [ ] Test `OrderService` (mock `OrderRepositoryPort`, `OrderEventPublisherPort`)
- [ ] Test `ProductMapper` (DTO <-> Domain)
- [ ] Test `CartMapper`
- [ ] Test `OrderMapper`
- [ ] Test `ProductController` (`@WebMvcTest` + MockMvc)
- [ ] Test `CartController` (`@WebMvcTest` + MockMvc)
- [ ] Test `OrderController` (`@WebMvcTest` + MockMvc)
- [ ] Achieve > 80% code coverage on domain + application layers

### Unit Tests — Frontend (Jasmine + Karma)

- [ ] Test `ProductListComponent` (rendering, pagination, filter events)
- [ ] Test `ProductDetailComponent` (display, add-to-cart interaction)
- [ ] Test `CartPageComponent` (items display, quantity update, remove)
- [ ] Test `CheckoutComponent` (form validation, submit)
- [ ] Test `ProductService` (HTTP calls via `HttpClientTestingModule`)
- [ ] Test `CartService`
- [ ] Test `OrderService`
- [ ] Test `product.reducer.ts` (state transitions)
- [ ] Test `cart.reducer.ts`
- [ ] Test `product.effects.ts` (`provideMockActions`, marbles)
- [ ] Test `cart.effects.ts`
- [ ] Test `product.selectors.ts` (projector)
- [ ] Test `cart.selectors.ts`
- [ ] Test `product.mapper.ts`
- [ ] Test `cart.mapper.ts`
- [ ] Test `order.mapper.ts`
- [ ] Test `CurrencyFormatPipe`
- [ ] Test `AuthGuard` / `RoleGuard`
- [ ] Achieve > 75% code coverage

### Integration Tests — Testcontainers

- [ ] Test `ProductPersistenceAdapter` with `PostgreSQLContainer`
- [ ] Test `CartPersistenceAdapter` with `PostgreSQLContainer`
- [ ] Test `OrderPersistenceAdapter` with `PostgreSQLContainer`
- [ ] Test Liquibase migrations run successfully on fresh database
- [ ] Test `OrderEventKafkaPublisher` with `KafkaContainer`
- [ ] Test `OrderEventConsumer` with `KafkaContainer`
- [ ] Test `MinioImageStorageAdapter` with `MinIOContainer`
- [ ] Test security configuration with `KeycloakContainer`
- [ ] Test full request flow: Controller -> Service -> Repository (with containers)

### Functional Tests — Cucumber (BDD)

- [ ] Write `product-catalog.feature` (search, filter, view detail)
- [ ] Write `shopping-cart.feature` (add, update, remove, persistence)
- [ ] Write `checkout.feature` (place order, stock validation, payment)
- [ ] Write `user-auth.feature` (register, login, role access)
- [ ] Write `seller-dashboard.feature` (create product, manage inventory, fulfill order)
- [ ] Implement step definitions for Product steps
- [ ] Implement step definitions for Cart steps
- [ ] Implement step definitions for Order steps
- [ ] Implement step definitions for Auth steps
- [ ] Implement step definitions for Seller steps
- [ ] Create `CucumberRunnerIT.java`
- [ ] Create `CucumberSpringConfig.java` (Testcontainers for Cucumber context)

### E2E Tests — Cypress

- [ ] Configure Cypress in frontend project
- [ ] Write E2E: User browses product catalog
- [ ] Write E2E: User searches for a product
- [ ] Write E2E: User adds product to cart and checks out
- [ ] Write E2E: Seller creates a new product
- [ ] Write E2E: Authentication flow (login / logout)
- [ ] Configure Cypress in CI pipeline

### Performance Tests — JMeter + Gatling

- [ ] Create JMeter test plan: `product-search.jmx`
- [ ] Create JMeter test plan: `checkout-flow.jmx`
- [ ] Create JMeter test plan: `concurrent-users.jmx` (ramp to 500 users)
- [ ] Create test data files (`users.csv`, `products.csv`)
- [ ] Create Gatling simulation: `ProductSearchSimulation`
- [ ] Create Gatling simulation: `CheckoutSimulation`
- [ ] Validate: avg response < 200ms (GET /products)
- [ ] Validate: p95 < 500ms (GET /products/{id})
- [ ] Validate: throughput > 50 req/s (checkout)
- [ ] Validate: error rate < 1% under load
- [ ] Run 1h endurance test — no memory leaks

### Security Tests

- [ ] Run Trivy on backend Docker image — 0 CRITICAL/HIGH
- [ ] Run Trivy on frontend Docker image — 0 CRITICAL/HIGH
- [ ] Run Trivy filesystem scan on codebase
- [ ] Run OWASP Dependency-Check on Maven dependencies
- [ ] Run `npm audit` on frontend dependencies — 0 high/critical
- [ ] Run OWASP ZAP baseline scan on running backend
- [ ] Run OWASP ZAP full scan on running frontend
- [ ] Run SonarQube analysis — 0 blocker/critical issues
- [ ] Run Checkmarx SAST scan (if available)
- [ ] Run Checkov on Terraform files — 0 FAILED checks
- [ ] Run Snyk on all projects (code + containers + IaC)
- [ ] Verify no secrets in codebase (git-secrets / gitleaks)

### Other Quality Tests

- [ ] Run PITest mutation testing — mutation score > 70%
- [ ] Set up Spring Cloud Contract / Pact for API contract tests
- [ ] Run axe-core accessibility audit on frontend — 0 critical violations
- [ ] Set up Chaos Monkey for Spring Boot (dev/staging only)
- [ ] Configure ESLint + Prettier for frontend
- [ ] Configure Checkstyle for backend
- [ ] Run linting — 0 errors

---

## 6. CI/CD Pipeline

- [ ] Create `.github/workflows/ci.yml` (or equivalent)
- [ ] Backend: build + unit tests + integration tests
- [ ] Frontend: build + unit tests + lint
- [ ] Run Cucumber functional tests
- [ ] Run Trivy container scan
- [ ] Run OWASP Dependency-Check
- [ ] Run SonarQube analysis
- [ ] Run Checkov on Terraform
- [ ] Build & push Docker images to ACR
- [ ] Deploy to staging (Helm upgrade)
- [ ] Run OWASP ZAP on staging
- [ ] Run performance tests on staging
- [ ] Manual approval gate for production
- [ ] Deploy to production

---

## 7. Documentation

- [x] Create `README.md` (global)
- [x] Document tech stack, architecture, profiles
- [x] Document functional features
- [x] Document testing strategy
- [x] Create `CONTRIBUTING.md` (coding standards, PR process)
- [ ] Create API documentation via Swagger annotations on controllers
- [x] Document Keycloak realm setup & roles
- [ ] Document Kafka topics & event schemas
- [x] Create architecture decision records (ADR) if needed
