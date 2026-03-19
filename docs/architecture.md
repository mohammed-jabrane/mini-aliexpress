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

### Key Patterns

| Pattern | Implementation |
|---------|---------------|
| Standalone components | All components use `standalone: true` (Angular 18 default) |
| Lazy loading | Each feature is route-level code-split via `loadChildren` |
| State management | NgRx Store for global state (products, cart, orders) |
| Signals | Angular Signals for fine-grained local component reactivity |
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

- **Terraform modules** are reusable across profiles — DRY principle
- **Helm charts** are parameterized per environment (local vs. AKS)
- **Docker Compose** provides the simplest local development experience
