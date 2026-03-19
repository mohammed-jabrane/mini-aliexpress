# Contributing

> Back to [README](README.md)

## Git Branching Strategy (GitHub Flow)

The project follows **GitHub Flow** — a lightweight, branch-based workflow centered on `main` always being deployable.

```
main ──●──────●──────●──────●──────●──── (always deployable)
        \    / \    / \    /      /
         ●──●   ●──●   ●──●    ●──●
       feature/ feature/ fix/  feature/
       product  cart     bug   seller
```

### Principles

1. **`main` is always deployable** — every commit on `main` has passed CI
2. **Branch off `main`** — create a descriptive branch for every change
3. **Open a Pull Request early** — get feedback before the code is finished
4. **CI must pass before merge** — the `ci-passed` quality gate is required
5. **Merge and deploy** — squash-merge into `main`, delete the branch

### Branch Types

| Branch      | From   | Merges into | Purpose                                                |
|-------------|--------|-------------|--------------------------------------------------------|
| `main`      | -      | -           | Production-ready code. Always deployable.              |
| `feature/*` | `main` | `main`      | New feature development (e.g., `feature/product-crud`) |
| `fix/*`     | `main` | `main`      | Bug fixes (e.g., `fix/cart-total-calculation`)          |
| `chore/*`   | `main` | `main`      | CI, config, docs, dependencies                         |
| `hotfix/*`  | `main` | `main`      | Critical production fixes (fast-tracked review)        |

### Naming Conventions

```
feature/product-crud
feature/cart-management
feature/order-checkout
feature/keycloak-auth
feature/kafka-events
feature/seller-dashboard
fix/cart-total-calculation
chore/upgrade-actions-to-v6
hotfix/payment-timeout
```

### Workflow

1. **Create a branch** from `main`
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/product-crud
   ```

2. **Work on the feature** — commit frequently with clear messages
   ```bash
   git add .
   git commit -m "feat(product): add product CRUD endpoints"
   ```

3. **Push and open a Pull Request**
   ```bash
   git push -u origin feature/product-crud
   gh pr create --title "feat(product): add CRUD endpoints" --base main
   ```

4. **CI runs automatically** — build, tests, SonarCloud must all pass
   - Backend: build + unit tests + JaCoCo coverage
   - Frontend: build + unit tests (ChromeHeadless) + coverage
   - SonarCloud: code quality analysis (backend + frontend)
   - Quality gate: `ci-passed` aggregates all checks

5. **Review and merge** — at least one approval required
   - Use **"Squash and merge"** for a clean `main` history
   - Delete the branch after merge

6. **Hotfix** — same workflow, but with expedited review
   ```bash
   git checkout main
   git checkout -b hotfix/payment-timeout
   # fix, push, open PR with "hotfix" label
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
chore(ci): upgrade GitHub Actions to Node.js 24
docs: update README with GitHub Flow branching strategy
```

---

## Pull Request Process

1. Create a branch from `main` following the naming conventions above
2. Make your changes with clear, atomic commits
3. Ensure all tests pass locally (`make test`)
4. Update documentation if your changes affect public APIs or architecture
5. Push and open a Pull Request targeting `main`
6. Fill in the PR template with a summary, test plan, and any relevant screenshots
7. Wait for CI to pass — all checks in `ci-passed` must be green
8. Request a review — at least one approval required before merging
9. Merge using **"Squash and merge"** for a clean commit history
10. Delete the branch after merge

### Branch Protection Rules (recommended)

| Rule                             | Setting |
|----------------------------------|---------|
| Require PR before merging        | Yes     |
| Require approvals                | 1+      |
| Require status checks (`ci-passed`) | Yes  |
| Require branches to be up to date | Yes    |
| Require linear history           | Yes (squash merge) |
| Delete branches on merge         | Yes     |

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
