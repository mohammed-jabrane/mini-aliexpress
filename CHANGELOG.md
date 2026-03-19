# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [5.0.0] — Planned

### Added
- Migration to AWS

## [4.0.0] — Planned

### Added
- Payment with card

## [3.0.0] — Planned

### Added
- Multilanguage platform

## [2.3.0] — Planned

### Added
- Azure PaaS (no Kubernetes) Terraform deployment profile
- Terraform modules: AKS, PostgreSQL, Blob Storage, Event Hubs, Keycloak VM, Networking, Container Registry

## [2.2.0] — Planned

### Added
- Minikube Helm chart for local Kubernetes deployment
- Azure AKS Terraform + Helm deployment profile
- Admin Panel
- Comprehensive testing strategy (unit, integration, BDD, performance, security)

## [2.1.0] - GitHub Actions CI Pipeline & SonarCloud

### Added
- GitHub Actions CI workflow (`.github/workflows/ci.yml`) — required quality gate before merge
- Backend: build, unit tests, JaCoCo coverage report
- JaCoCo Maven plugin (`jacoco-maven-plugin` 0.8.12) — generates XML/HTML coverage on `mvn verify`
- SonarCloud: monorepo analysis (backend + frontend in one project) via `SonarSource/sonarcloud-github-action@v3`
- `sonar-project.properties` at repo root — defines `backend` and `frontend` modules with coverage paths
- Frontend: install, unit tests (ChromeHeadless), production build, lcov coverage
- `ci-passed` job aggregates all checks — use as required status check in branch protection rules
- Node.js 24 opt-in (`FORCE_JAVASCRIPT_ACTIONS_TO_NODE24`) to suppress deprecation warnings

## [2.0.0] - Core Module (Auth, Guards, Interceptors, Notifications)

### Added
- `AuthKeycloakService` — wrapper around `KeycloakService` exposing Angular Signals (`isAuthenticated`, `currentUsername`, `currentRoles`)
- `authGuard` — functional `CanActivateFn` that redirects unauthenticated users to Keycloak login
- `roleGuard` — functional `CanActivateFn` that checks `route.data['roles']` with OR logic
- `authInterceptor` — functional `HttpInterceptorFn` handling 401 (force re-login) and 403 (notification + redirect)
- `errorInterceptor` — functional `HttpInterceptorFn` mapping HTTP error codes to user-friendly notification messages
- `NotificationService` — `MatSnackBar` wrapper with `success`, `error`, `info`, `warn` methods (top-right, color-coded)
- Global snackbar CSS classes (`snackbar-success`, `snackbar-error`, `snackbar-info`, `snackbar-warn`)
- Commented-out route skeletons in `app.routes.ts` for `/cart`, `/orders`, `/seller`, `/admin` with guard patterns
- Unit tests for all core module files (31 specs)

### Changed
- `HeaderComponent` now uses `AuthKeycloakService` signals via `inject()` instead of `KeycloakService` directly
- `app.config.ts` registers `authInterceptor` and `errorInterceptor` alongside keycloak-angular's built-in bearer interceptor
- Username read from JWT `preferred_username` claim (sync) instead of `loadUserProfile()` HTTP call (avoids CORS issue with Keycloak account endpoint)

### Fixed
- `AuthKeycloakService` no longer calls `getUsername()` / `loadUserProfile()` when user is not logged in (keycloak-angular throws if profile not loaded)

## [1.1.0] - MVP release

### Added
- Angular Material integration (Indigo-Pink theme, Material Icons, Roboto font)
- Shared components: header (search bar, auth menu), footer, product-card
- Product list page with category chip filters, sorting (price, name, date), and search
- Product detail page with image gallery, stock indicator, seller info, and add-to-cart
- Product service (`getProducts`, `getProduct`, `getCategories`)
- Lazy-loaded product feature routes (`/products`, `/products/:id`)
- Angular Signals for product component state management
- Keycloak silent SSO check page

### Fixed
- Spring Security dual `SecurityFilterChain` to allow public GET access to `/products` and `/categories` without JWT validation
- CORS issues resolved by using Angular dev server proxy (`/api` relative URL)
- Keycloak bearer interceptor excluded for public API endpoints (`bearerExcludedUrls`)

## [1.0.0] - Initial release

### Added
- Project scaffolding with Spring Boot 3.5 backend and Angular 18 frontend
- Hexagonal architecture (Ports & Adapters) for the backend
- Feature-based modular architecture for the frontend
- Product API (CRUD + search) with domain model, ports, adapters, and MapStruct mappers
- Category API (list, tree) with persistence layer
- Docker Compose local development environment (PostgreSQL, Kafka, Minio, Keycloak)
- IntelliJ IDEA shared run configurations
- Makefile for project orchestration
- SpringDoc OpenAPI / Swagger UI with OAuth2 PKCE integration
- Multi-stage Dockerfiles for backend and frontend
- Liquibase database migrations (categories, products, carts, orders, addresses, seed data)
- Keycloak realm configuration with roles (`ROLE_USER`, `ROLE_SELLER`, `ROLE_ADMIN`)
- NgRx and Keycloak-Angular setup in frontend
- Proxy configuration for local development
