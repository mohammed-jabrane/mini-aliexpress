# ADR-001: Hexagonal Architecture for Backend

## Status

Accepted

## Date

2025-01-01

## Context

The backend needs a clear architectural pattern that:

- Separates business logic from infrastructure concerns (database, messaging, HTTP)
- Makes the domain testable without Spring context or external dependencies
- Allows swapping infrastructure adapters (e.g., switching from Minio to Azure Blob Storage) without touching business logic
- Supports multiple deployment profiles (local Docker, Kubernetes, Azure PaaS) where the same domain runs with different infrastructure adapters

Traditional layered architecture (Controller → Service → Repository) tightly couples business logic to the framework and makes it difficult to test domain rules in isolation.

## Decision

We adopt **Hexagonal Architecture** (Ports & Adapters) for the backend, structured as:

```
domain/                  # Pure business logic — no framework dependencies
├── model/               #   Entities, value objects
├── port/in/             #   Input ports (use-case interfaces)
├── port/out/            #   Output ports (repository / service interfaces)
└── exception/           #   Domain exceptions

application/             # Use-case orchestration
├── service/             #   Implements input ports
├── dto/                 #   Data Transfer Objects
└── mapper/              #   DTO ↔ Domain mappers

infrastructure/          # Framework-specific adapters
└── adapter/
    ├── in/web/          #   REST controllers (driving)
    └── out/
        ├── persistence/ #   JPA repositories (driven)
        ├── messaging/   #   Kafka producers/consumers (driven)
        └── storage/     #   Minio / Azure Blob (driven)
```

**Key rules:**

1. The `domain` package has **zero** imports from Spring, JPA, or any framework
2. Input ports define **what** the application can do (use cases)
3. Output ports define **what** the application needs (repositories, event publishers)
4. Adapters implement ports and live in `infrastructure`
5. Dependency direction always points inward: `infrastructure → application → domain`

## Consequences

### Positive

- Domain logic is fully testable with plain JUnit + Mockito (no Spring context needed)
- Infrastructure can be swapped per deployment profile (e.g., `MinioImageStorageAdapter` for local, `AzureBlobImageStorageAdapter` for Azure PaaS)
- Clear boundaries make the codebase navigable and enforce separation of concerns
- New team members can understand the architecture by following the port/adapter convention

### Negative

- More packages and files compared to a simple layered architecture
- Mapping between JPA entities and domain models adds boilerplate
- Developers must understand the pattern to contribute effectively

### Neutral

- Spring dependency injection naturally supports port/adapter wiring via `@Component` / `@Bean`
- The pattern is well-documented and widely adopted in the Java ecosystem
