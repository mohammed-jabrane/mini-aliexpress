# Backend — Spring Boot 3.5

> Back to [project README](../README.md) | [Architecture](../docs/architecture.md)

## Tech Stack

| Technology                | Version | Purpose                                      |
|---------------------------|---------|----------------------------------------------|
| Java                      | 17      | Language                                     |
| Spring Boot               | 3.5     | Application framework                        |
| Spring Data JPA           | -       | Data access layer                            |
| PostgreSQL                | 16      | Relational database                          |
| Liquibase                 | -       | Database schema versioning & migrations      |
| Kafka                     | 3.4     | Asynchronous messaging / event streaming     |
| Confluent Schema Registry | 7.6     | Schema management for Kafka (Avro/JSON)      |
| Minio (S3)                | -       | Object storage (product images, assets)      |
| Keycloak                  | 26      | Identity & access management (OAuth2 / OIDC) |
| SpringDoc OpenAPI         | 2.8     | API documentation (Swagger UI)               |
| Lombok                    | -       | Boilerplate reduction                        |

## Architecture

The backend follows **Hexagonal Architecture** (Ports & Adapters). See [docs/architecture.md](../docs/architecture.md)
for full details and [ADR-001](../docs/adr/001-hexagonal-architecture.md) for the decision rationale.

```
domain/          → Pure business logic (no framework deps)
application/     → Use-case orchestration (services, DTOs, mappers)
infrastructure/  → Adapters (REST, JPA, Kafka, Minio, config)
```

## Running

```bash
# Using Makefile
make backend

# Using Maven directly
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

Requires infrastructure services running (see [Deployment](../docs/deployment.md)).

## Configuration Profiles

| Profile          | File                              | Use case                   |
|------------------|-----------------------------------|----------------------------|
| `local`          | `application-local.yaml`          | Docker Compose development |
| `local-k8s`      | `application-local-k8s.yaml`      | Minikube Kubernetes        |
| `azure-aks`      | `application-azure-aks.yaml`      | Azure AKS cluster          |
| `azure-services` | `application-azure-services.yaml` | Azure PaaS (no K8s)        |

All profiles inherit from `application.yaml` (shared: server, JPA, Liquibase, OpenAPI settings).

---

## Testing

### Unit Tests — JUnit 5 + Mockito

Fast, isolated tests for domain logic & application services. No Spring context loaded.

| Layer                | What is tested                          | Mocking strategy                      |
|----------------------|-----------------------------------------|---------------------------------------|
| Domain model         | Entities, value objects, business rules | No mocks needed (pure logic)          |
| Application services | Use-case orchestration                  | Mockito mocks for output ports        |
| Mappers              | DTO <-> Domain conversions              | No mocks (pure mapping)               |
| Controllers          | Request/Response mapping                | `@WebMvcTest` + MockMvc + `@MockBean` |

```bash
./mvnw test
```

**Test structure:**

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

### Integration Tests — Testcontainers

Test real infrastructure interactions using disposable Docker containers. No mocks for external systems.

| Container             | What is tested                                               |
|-----------------------|--------------------------------------------------------------|
| `PostgreSQLContainer` | JPA repositories, Liquibase migrations, complex queries      |
| `KafkaContainer`      | Kafka producer/consumer, event serialization, topic creation |
| `MinIOContainer`      | S3 file upload/download, bucket operations                   |
| `KeycloakContainer`   | OAuth2 token validation, role-based access control           |

```bash
./mvnw verify -Pintegration-tests
```

**Test structure:**

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

### Functional Tests (BDD) — Cucumber

Behavior-driven tests written in Gherkin (`Given / When / Then`) to validate business scenarios end-to-end.

| Feature file               | Scenario examples                                |
|----------------------------|--------------------------------------------------|
| `product-catalog.feature`  | Search products, filter by category, view detail |
| `shopping-cart.feature`    | Add to cart, update quantity, remove item        |
| `checkout.feature`         | Place order, validate stock, payment flow        |
| `user-auth.feature`        | Register, login, role-based access               |
| `seller-dashboard.feature` | Create product, manage inventory, fulfill order  |

```bash
./mvnw verify -Pcucumber
```

**Test structure:**

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

### Performance Tests — JMeter + Gatling

Load and stress tests to validate API throughput, response times, and system behavior under pressure.

| Tool              | Purpose                                         | Scenarios                                        |
|-------------------|-------------------------------------------------|--------------------------------------------------|
| **Apache JMeter** | Load testing, stress testing, endurance testing | Product search, checkout flow, concurrent users  |
| **Gatling**       | High-performance load simulation (code-based)   | API endpoint stress, WebSocket, ramp-up patterns |

```bash
# Run JMeter tests (headless)
jmeter -n -t tests/performance/jmeter/product-search.jmx -l results.jtl -e -o report/

# Run Gatling simulations
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

| Metric                                | Target                          |
|---------------------------------------|---------------------------------|
| Average response time (GET /products) | < 200 ms                        |
| 95th percentile (GET /products/{id})  | < 500 ms                        |
| Throughput (checkout flow)            | > 50 req/s                      |
| Error rate under load                 | < 1%                            |
| System stability (1h endurance)       | No memory leaks, no degradation |

### Mutation Testing — PITest

```bash
./mvnw org.pitest:pitest-maven:mutationCoverage
```

Target: mutation score > 70%.

### API Contract Testing

```bash
./mvnw verify -Pcontract-tests
```

Uses Spring Cloud Contract / Pact to verify API contracts between frontend and backend.

---

## Database Migrations

Database schema changes are managed with **Liquibase**. Changelogs are located in:

```
src/main/resources/db/changelog/
```

Migrations run automatically on application startup.

### Makefile Shortcuts

```bash
make backend              # Start backend
make backend-build        # Build JAR
make backend-test         # Run unit tests
make test-integration     # Run Testcontainers tests
make test-cucumber        # Run Cucumber BDD tests
make test-performance     # Run Gatling tests
make test-mutation        # Run PITest mutation tests
```
