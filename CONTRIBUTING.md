# Contributing

> Back to [README](README.md)

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

| Branch      | From      | Merges into        | Purpose                                                |
|-------------|-----------|--------------------|--------------------------------------------------------|
| `main`      | -         | -                  | Production-ready code. Every commit is a release.      |
| `develop`   | `main`    | -                  | Integration branch. All features merge here first.     |
| `feature/*` | `develop` | `develop`          | New feature development (e.g., `feature/product-crud`) |
| `release/*` | `develop` | `main` + `develop` | Release preparation, version bump, last-minute fixes   |
| `hotfix/*`  | `main`    | `main` + `develop` | Critical production bug fixes                          |
| `bugfix/*`  | `develop` | `develop`          | Non-critical bug fixes during development              |

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

---

## Commit Message Convention

The project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]
```

| Type       | Usage                                   |
|------------|-----------------------------------------|
| `feat`     | New feature                             |
| `fix`      | Bug fix                                 |
| `docs`     | Documentation only                      |
| `refactor` | Code restructuring (no behavior change) |
| `test`     | Adding or updating tests                |
| `chore`    | Build, CI, config changes               |
| `perf`     | Performance improvement                 |
| `style`    | Formatting, no logic change             |

**Examples:**

```
feat(product): add product search with pagination
fix(cart): correct total calculation with discounts
test(order): add Testcontainers integration tests for OrderRepository
chore(infra): add Kafka and Minio to Docker Compose
docs: update README with Gitflow branching strategy
```

---

## Pull Request Process

1. Create a feature branch from `develop` following the naming conventions above
2. Make your changes with clear, atomic commits
3. Ensure all tests pass (`make test`)
4. Update documentation if your changes affect public APIs or architecture
5. Open a Pull Request targeting `develop`
6. Fill in the PR template with a summary, test plan, and any relevant screenshots
7. Request a review — at least one approval required before merging
8. Merge using **"Merge commit"** (`--no-ff`) to preserve branch history

---

## Code Style

### Backend (Java)

- Follow standard Java conventions
- Use Lombok annotations to reduce boilerplate (`@Data`, `@Builder`, `@RequiredArgsConstructor`)
- Enforce style with Checkstyle (see `backend/pom.xml` for rules)
- Package by architectural layer (`domain`, `application`, `infrastructure`)

### Frontend (TypeScript/Angular)

- Follow the [Angular Style Guide](https://angular.dev/style-guide)
- Use standalone components (Angular 18 default)
- Enforce style with ESLint + Prettier
- Run `ng lint` before committing
