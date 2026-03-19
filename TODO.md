# Mini AliExpress — Project Checklist

---

## 1. Project Setup

### Project Init (FA01)

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

### Documentation Structure (FA04)

- [x] Create a new structure of .md based on best practice

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
- [x] Create changeset: `008-seed-fake-data`

### OAuth2, Keycloak & OpenAPI (FA07)

- [x] Create `OpenApiConfig` with OAuth2 Authorization Code + PKCE security scheme
- [x] Configure Swagger UI OAuth2 client (`client-id`, PKCE) in `application.yaml` / `application-local.yaml`
- [x] Add Swagger redirect URI to Keycloak realm export (`mini-aliexpress-frontend` client)
- [x] SecurityConfig permits Swagger UI and OpenAPI endpoints

### Product API (FA06)

- [x] Create entity `Product` (id, name, description, price, stock, category, sellerId, images, createdAt, updatedAt)
- [x] Create entity `Category` (id, name, parentId)
- [x] Create `CreateProductUseCase`, `SearchProductsUseCase`, `GetProductByIdUseCase`, `UpdateProductUseCase`, `DeleteProductUseCase`
- [x] Create `ProductRepositoryPort`, `CategoryRepositoryPort`
- [x] Create `ProductNotFoundException`
- [x] Implement `ProductService` (implements product use cases)
- [x] Create `ProductRequestDTO` / `ProductResponseDTO` / `CategoryDTO`
- [x] Create `ProductMapper` (MapStruct, DTO <-> Domain)
- [x] Create `ProductController` (REST CRUD + search)
- [x] Create `CategoryController` (list, tree)
- [x] Create `ProductJpaEntity` + `ProductJpaRepository`
- [x] Create `CategoryJpaEntity` + `CategoryJpaRepository`
- [x] Create `ProductPersistenceMapper` + `CategoryPersistenceMapper` (MapStruct)
- [x] Create `ProductPersistenceAdapter` + `CategoryPersistenceAdapter`
- [x] Add MapStruct + lombok-mapstruct-binding dependencies to `pom.xml`

### Category API — CRUD (FA11)

- [ ] Create `CreateCategoryUseCase`
- [ ] Create `GetCategoryByIdUseCase`
- [ ] Create `GetAllCategoriesUseCase`
- [ ] Create `GetCategoryTreeUseCase`
- [ ] Create `UpdateCategoryUseCase`
- [ ] Create `DeleteCategoryUseCase`
- [ ] Create `CategoryNotFoundException`
- [ ] Implement `CategoryService` (implements category use cases)
- [ ] Create `CategoryRequestDTO` / `CategoryResponseDTO`
- [ ] Create `CategoryMapper` (MapStruct, DTO <-> Domain)
- [ ] Update `CategoryController` (add create, update, delete endpoints)
- [ ] Update `CategoryPersistenceAdapter` (implement new use case ports)
- [ ] Test `CategoryService` (mock `CategoryRepositoryPort`)
- [ ] Test `CategoryMapper` (DTO <-> Domain)
- [ ] Test `CategoryController` (`@WebMvcTest` + MockMvc)

### Cart API

#### Domain
- [ ] Create entity `Cart` (id, userId, items, createdAt)
- [ ] Create entity `CartItem` (productId, quantity, unitPrice)
- [ ] Create `AddToCartUseCase`
- [ ] Create `UpdateCartItemUseCase`
- [ ] Create `RemoveFromCartUseCase`
- [ ] Create `GetCartUseCase`
- [ ] Create `CartRepositoryPort`
- [ ] Create `InsufficientStockException`

#### Application
- [ ] Implement `CartService` (implements cart use cases)
- [ ] Create `CartDTO` / `CartItemDTO`
- [ ] Create `CartMapper`

#### Infrastructure
- [ ] Create `CartController` (get, add, update, remove)
- [ ] Create `CartJpaEntity` / `CartItemJpaEntity` + `CartJpaRepository`
- [ ] Create `CartPersistenceAdapter` (implements `CartRepositoryPort`)
- [ ] Create Cart JPA entity <-> Domain model mappers

### Order API

#### Domain
- [ ] Create entity `Order` (id, userId, items, status, totalAmount, shippingAddress, createdAt)
- [ ] Create entity `OrderItem` (productId, productName, quantity, unitPrice)
- [ ] Create enum `OrderStatus` (PENDING, PAID, SHIPPED, DELIVERED, CANCELLED)
- [ ] Create `PlaceOrderUseCase`
- [ ] Create `GetOrderByIdUseCase`
- [ ] Create `ListOrdersUseCase`
- [ ] Create `UpdateOrderStatusUseCase`
- [ ] Create `OrderRepositoryPort`
- [ ] Create `OrderEventPublisherPort`
- [ ] Create `OrderNotFoundException`

#### Application
- [ ] Implement `OrderService` (implements order use cases)
- [ ] Create `OrderRequestDTO` / `OrderResponseDTO`
- [ ] Create `AddressDTO`
- [ ] Create `PageResponseDTO<T>` (pagination wrapper)
- [ ] Create `OrderMapper`
- [ ] Create `AddressMapper`

#### Infrastructure
- [ ] Create `OrderController` (place, get, list, update status)
- [ ] Create `OrderJpaEntity` / `OrderItemJpaEntity` + `OrderJpaRepository`
- [ ] Create `OrderPersistenceAdapter` (implements `OrderRepositoryPort`)
- [ ] Create Order JPA entity <-> Domain model mappers

### User & Address

- [ ] Create entity `User` (id, username, email, firstName, lastName, role)
- [ ] Create entity `Address` (id, userId, street, city, zipCode, country)
- [ ] Create value objects where appropriate (Money, ProductId, etc.)
- [ ] Create `UnauthorizedAccessException`

### Image Upload

- [ ] Create `UploadImageUseCase`
- [ ] Create `ImageStoragePort`
- [ ] Implement `ImageService` (implements image use case)
- [ ] Create `ImageController` (upload endpoint)
- [ ] Create `MinioImageStorageAdapter` (implements `ImageStoragePort`)
- [ ] Create `AzureBlobImageStorageAdapter` (implements `ImageStoragePort` for azure-services profile)

### Kafka Messaging

- [ ] Create `OrderEventKafkaPublisher` (implements `OrderEventPublisherPort`)
- [ ] Create `OrderEventConsumer` (`@KafkaListener`)
- [ ] Create `StockEventConsumer` (`@KafkaListener`)
- [ ] Define Kafka topics (order-events, product-events, payment-events, stock-events)
- [ ] Create event DTOs (`OrderPlacedEvent`, `PaymentProcessedEvent`, `StockLowEvent`)

### Global Error Handling

- [ ] Create `GlobalExceptionHandler` (`@RestControllerAdvice`)

### Infrastructure Configuration

- [ ] Create `infrastructure.config.kafka.KafkaConfig`
- [ ] Create `infrastructure.config.kafka.KafkaTopicConfig`
- [x] Create `infrastructure.config.security.SecurityConfig` (Spring Security + Keycloak JWT)
- [ ] Create `infrastructure.config.security.JwtAuthConverter`
- [ ] Create `infrastructure.config.storage.MinioConfig`
- [ ] Create `infrastructure.config.storage.AzureBlobConfig`
- [x] Create `infrastructure.config.OpenApiConfig` (Swagger customization)
- [ ] Create CORS configuration

---

## 3. Frontend — Angular 18

### Core Module (FA10)

- [x] Create `core/auth/keycloak.service.ts` (`AuthKeycloakService` — signals wrapper)
- [x] Create `core/auth/auth.guard.ts` (functional `CanActivateFn`)
- [x] Create `core/auth/role.guard.ts` (functional `CanActivateFn` with role check)
- [x] Create `core/interceptors/auth.interceptor.ts` (401/403 response handling)
- [x] Create `core/interceptors/error.interceptor.ts` (global HTTP error notifications)
- [x] Create `core/services/notification.service.ts` (MatSnackBar wrapper)

### Shared Module (FA09)

- [x] Create `shared/components/header/` (navbar, search bar, cart icon, user menu)
- [x] Create `shared/components/footer/`
- [x] Create `shared/components/product-card/` (reusable card component)
- [x] Create `shared/components/pagination/`
- [x] Create `shared/components/loading-spinner/`
- [x] Create `shared/components/confirm-dialog/`
- [x] Create `shared/pipes/currency-format.pipe.ts`
- [x] Create `shared/pipes/truncate.pipe.ts`
- [ ] Create `shared/mappers/product.mapper.ts`
- [ ] Create `shared/mappers/cart.mapper.ts`
- [ ] Create `shared/mappers/order.mapper.ts`
- [x] Create `shared/models/` (frontend domain models)

### Feature — Product (FA08)

- [x] Create `features/product/product.routes.ts` (lazy-loaded)
- [x] Create `features/product/pages/product-list/` (grid, filters, sorting, pagination)
- [x] Create `features/product/pages/product-detail/` (images gallery, add to cart, seller info)
- [x] Create `features/product/pages/product-search/` (search results via header search bar + query params)
- [x] Create `features/product/services/product.service.ts`
- [x] Implement product Signals for local component state

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

- [ ] Create `store/product/` (actions, reducer, effects, selectors)
- [ ] Create `store/cart/` (actions, reducer, effects, selectors)
- [ ] Create `store/order/` (actions, reducer, effects, selectors)
- [ ] Create `store/auth/` (actions, reducer, selectors)

### Routing (app.routes.ts)

- [x] Configure lazy-loaded route for `/products`
- [ ] Configure lazy-loaded route for `/cart` (with `authGuard`)
- [ ] Configure lazy-loaded route for `/orders` (with `authGuard`)
- [ ] Configure lazy-loaded route for `/user` (with `authGuard`)
- [ ] Configure lazy-loaded route for `/seller` (with `authGuard` + `roleGuard ROLE_SELLER`)
- [ ] Configure lazy-loaded route for `/admin` (with `authGuard` + `roleGuard ROLE_ADMIN`)
- [x] Configure wildcard redirect to `/products`

---

## 4. Infrastructure

### Profile 1 — Local (Docker Compose)

- [x] Create `infra/docker/local/docker-compose.yml`
- [x] Create `.env` file
- [x] Create `config/postgres/init.sql`
- [x] Create `config/keycloak/realm-export.json`
- [x] Test `docker compose up -d` — all services healthy
- [x] Verify Keycloak realm auto-import
- [x] Verify Minio buckets auto-created
- [x] Verify Kafka UI accessible

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
- [ ] Test NgRx reducers (state transitions)
- [ ] Test NgRx effects (`provideMockActions`, marbles)
- [ ] Test NgRx selectors (projector)
- [ ] Test mappers (`product.mapper.ts`, `cart.mapper.ts`, `order.mapper.ts`)
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
- [ ] Implement step definitions (Product, Cart, Order, Auth, Seller)
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

- [ ] Create JMeter test plans (`product-search.jmx`, `checkout-flow.jmx`, `concurrent-users.jmx`)
- [ ] Create test data files (`users.csv`, `products.csv`)
- [ ] Create Gatling simulations (`ProductSearchSimulation`, `CheckoutSimulation`)
- [ ] Validate: avg response < 200ms, p95 < 500ms, throughput > 50 req/s, error rate < 1%
- [ ] Run 1h endurance test — no memory leaks

### Security Tests

- [ ] Run Trivy on Docker images — 0 CRITICAL/HIGH
- [ ] Run Trivy filesystem scan on codebase
- [ ] Run OWASP Dependency-Check on Maven dependencies
- [ ] Run `npm audit` on frontend dependencies — 0 high/critical
- [ ] Run OWASP ZAP baseline scan on running app
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
