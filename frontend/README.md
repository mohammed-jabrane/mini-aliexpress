# Frontend — Angular 18

> Back to [project README](../README.md) | [Architecture](../docs/architecture.md)

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 18 | SPA framework (standalone components) |
| TypeScript | 5.5 | Language |
| NgRx | - | Reactive state management (Store, Effects, Selectors) |
| Angular Signals | - | Fine-grained reactivity |
| Lazy Loading | - | Route-level code splitting |
| Mappers | - | DTO-to-Model transformation layer |
| RxJS | 7.8 | Reactive programming |

## Architecture

The frontend follows a **feature-based modular architecture**. See [docs/architecture.md](../docs/architecture.md) for full details.

```
core/      → Singleton services, guards, interceptors (auth, HTTP)
shared/    → Reusable components, pipes, mappers
features/  → Lazy-loaded feature modules (product, cart, order, user)
store/     → NgRx global state (actions, reducers, effects, selectors)
```

## Running

```bash
# Using Makefile
make frontend

# Using Angular CLI directly
npm install && ng serve
```

The dev server starts at http://localhost:4200. Requires backend running (see [Deployment](../docs/deployment.md)).

## Planned Dependencies

| Package | Purpose |
|---------|---------|
| `@ngrx/store` | Global state management |
| `@ngrx/effects` | Side effects (API calls) |
| `@ngrx/store-devtools` | Redux DevTools integration |
| `@ngrx/entity` | Entity collection management |
| `keycloak-angular` | Keycloak integration for Angular |
| `keycloak-js` | Keycloak JavaScript adapter |
| `cypress` | E2E testing |

---

## Testing

### Unit Tests — Jasmine + Karma

Isolated tests for Angular components, services, NgRx reducers, effects, selectors, and mappers.

| Target | What is tested | Tools |
|--------|---------------|-------|
| Components | Rendering, user interactions, inputs/outputs | `TestBed`, `ComponentFixture` |
| Services | HTTP calls, business logic | `HttpClientTestingModule` |
| NgRx Reducers | State transitions | Direct function calls |
| NgRx Effects | Side effects, API calls | `provideMockActions`, `jasmine-marbles` |
| NgRx Selectors | Memoized state queries | `projector()` method |
| Mappers | DTO <-> Model transformations | Direct function calls |
| Pipes | Value formatting | Direct instantiation |

```bash
# Watch mode
ng test

# CI mode with coverage
ng test --no-watch --code-coverage
```

### E2E Tests — Cypress

```bash
npx cypress run
```

### Accessibility Testing

```bash
npx axe-core http://localhost:4200
```

WCAG compliance auditing using axe-core / Pa11y.

### Visual Regression

Cypress + Percy for detecting unintended UI changes.

### Linting & Formatting

```bash
ng lint
```

Uses ESLint + Prettier for code consistency enforcement.

### Other Quality

| Test type | Tool | Purpose |
|-----------|------|---------|
| API Contract Testing | Pact | Verify API contracts with backend |
| Accessibility Testing | axe-core, Pa11y | WCAG compliance |
| Visual Regression | Cypress + Percy | Detect unintended UI changes |
| Linting & Formatting | ESLint, Prettier | Code consistency |

### Makefile Shortcuts

```bash
make frontend             # Start dev server
make frontend-install     # Install npm dependencies
make frontend-build       # Build for production
make frontend-test        # Run unit tests
```
