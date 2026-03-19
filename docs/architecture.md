# Architecture

> Back to [README](../README.md)

## Backend — Hexagonal Architecture (Ports & Adapters)

The backend follows hexagonal architecture to enforce a clean separation of concerns and keep the domain independent of external frameworks.

> See [ADR-001](adr/001-hexagonal-architecture.md) for the decision rationale.

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

### Dependency Rule

Dependencies always point **inward**:

```
infrastructure → application → domain
```

- `domain` has **zero** imports from Spring, JPA, or any framework
- `application` depends only on `domain`
- `infrastructure` depends on both and wires everything together via Spring DI

### Ports

| Type | Package | Role | Example |
|------|---------|------|---------|
| Input port | `domain.port.in` | Defines what the app **can do** (use cases) | `CreateProductUseCase`, `PlaceOrderUseCase` |
| Output port | `domain.port.out` | Defines what the app **needs** (SPI) | `ProductRepositoryPort`, `OrderEventPublisherPort` |

### Adapters

| Direction | Package | Role | Example |
|-----------|---------|------|---------|
| Driving (in) | `infrastructure.adapter.in.web` | Translates HTTP → use case calls | `ProductController` |
| Driven (out) | `infrastructure.adapter.out.persistence` | Implements repository ports via JPA | `ProductPersistenceAdapter` |
| Driven (out) | `infrastructure.adapter.out.messaging` | Implements event ports via Kafka | `OrderEventKafkaPublisher` |
| Driven (out) | `infrastructure.adapter.out.storage` | Implements storage ports via Minio/Blob | `MinioImageStorageAdapter` |

---

## Frontend — Feature-based Modular Architecture

```
src/app/
│
├── core/                       # Singleton services, guards, interceptors
│   ├── auth/                   #   Keycloak wrapper, auth & role guards
│   │   ├── keycloak.init.ts    #     APP_INITIALIZER (check-sso, bearer config)
│   │   ├── keycloak.service.ts #     AuthKeycloakService (signals + methods)
│   │   ├── auth.guard.ts       #     CanActivateFn — redirect to login if unauthenticated
│   │   └── role.guard.ts       #     CanActivateFn — check route.data['roles']
│   ├── interceptors/           #   HTTP interceptors (error handling)
│   │   ├── auth.interceptor.ts #     401 → re-login, 403 → notification + redirect
│   │   └── error.interceptor.ts#     Maps other HTTP errors to user-friendly notifications
│   └── services/               #   Cross-cutting services
│       └── notification.service.ts # MatSnackBar wrapper (success, error, info, warn)
│
├── shared/                     # Reusable components, pipes, directives
│   ├── components/             #   UI components (buttons, cards, modals)
│   ├── pipes/                  #   Custom pipes
│   └── mappers/                #   DTO <-> Model mappers
│
├── features/                   # Lazy-loaded feature modules
│   ├── product/                #   Product listing, detail, search
│   ├── cart/                   #   Shopping cart (authGuard)
│   ├── order/                  #   Order history (authGuard)
│   ├── user/                   #   User profile (authGuard)
│   ├── seller/                 #   Seller dashboard (authGuard + roleGuard ROLE_SELLER)
│   └── admin/                  #   Admin dashboard (authGuard + roleGuard ROLE_ADMIN)
│       ├── services/           #     AdminService (dashboard stats, user & category management)
│       ├── pages/
│       │   ├── dashboard/      #     Platform metrics (products, categories, orders, users)
│       │   ├── user-management/#     User list with ban/unban (MatTable)
│       │   └── category-management/ # Category CRUD (MatTable + form dialog)
│       └── components/
│           └── category-form-dialog/ # Create/Edit category dialog (reactive form)
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

### Key Patterns

| Pattern | Implementation |
|---------|---------------|
| Standalone components | All components use `standalone: true` (Angular 18 default) |
| Lazy loading | Each feature is route-level code-split via `loadChildren` |
| State management | NgRx Store for global state (products, cart, orders) |
| Signals | Angular Signals for fine-grained local component reactivity |
| Functional guards | `authGuard` and `roleGuard` as `CanActivateFn` (Angular 18 pattern) |
| Functional interceptors | `authInterceptor` and `errorInterceptor` as `HttpInterceptorFn` |
| Mappers | DTO-to-Model transformation layer isolates API shape from UI |

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

### Infrastructure as Code

The project follows a **progressive infrastructure** strategy across 5 environments:

| Env   | Profile      | IaC Tools                              | Description                           |
|-------|--------------|----------------------------------------|---------------------------------------|
| LOCAL | `local-docker` / `local-k8s` | Docker Compose / Helm + Minikube | Developer workstation         |
| INT   | `azure-int`  | Packer + Terraform + Ansible           | Azure VM with Docker Compose          |
| UAT   | `azure-uat`  | Terraform                              | Azure PaaS (PostgreSQL, Event Hubs, Key Vault) |
| OAT   | `azure-oat`  | Terraform + Helm                       | Azure AKS (pre-production, verbose logging) |
| PRD   | `azure-prd`  | Terraform + Helm                       | Azure AKS (production)                |

- **Terraform modules** are reusable across environments — DRY principle
- **Packer** builds immutable VM images for INT
- **Ansible** handles configuration management and service deployment on INT VMs
- **Helm charts** are parameterized per environment (local Minikube vs. AKS)
- **Azure Key Vault** manages secrets in UAT, OAT, and PRD
- **Docker Compose** provides the simplest local development experience
