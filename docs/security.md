# Security

> Back to [README](../README.md)

## OAuth2 / OpenID Connect — Keycloak

The project uses **Keycloak** for identity and access management across all deployment profiles.

### Realm Configuration

| Setting                | Value             |
|------------------------|-------------------|
| Realm name             | `mini-aliexpress` |
| Self-registration      | Enabled           |
| Login with email       | Enabled           |
| Brute force protection | Enabled           |
| Password reset         | Enabled           |

The realm is auto-imported from [
`infra/docker/local/config/keycloak/realm-export.json`](../infra/docker/local/config/keycloak/realm-export.json).

### Roles

| Role          | Description   | Capabilities                                                       |
|---------------|---------------|--------------------------------------------------------------------|
| `ROLE_USER`   | Standard user | Browse products, manage cart, place orders                         |
| `ROLE_SELLER` | Seller        | All user capabilities + manage products, inventory, fulfill orders |
| `ROLE_ADMIN`  | Administrator | All user capabilities + platform administration                    |

### Clients

| Client ID                  | Type         | Flow                                               | Redirect URIs             |
|----------------------------|--------------|----------------------------------------------------|---------------------------|
| `mini-aliexpress-backend`  | Confidential | Authorization Code, Direct Access, Service Account | `http://localhost:8080/*` |
| `mini-aliexpress-frontend` | Public       | Authorization Code + PKCE, Direct Access           | `http://localhost:4200/*` |

### Test Users

| Username | Password | Email                        | Roles                      |
|----------|----------|------------------------------|----------------------------|
| `user`   | `user`   | user@mini-aliexpress.local   | `ROLE_USER`                |
| `seller` | `seller` | seller@mini-aliexpress.local | `ROLE_USER`, `ROLE_SELLER` |
| `admin`  | `admin`  | admin@mini-aliexpress.local  | `ROLE_USER`, `ROLE_ADMIN`  |

### Integration

| Layer     | Integration                                                                                        |
|-----------|----------------------------------------------------------------------------------------------------|
| Backend   | Spring Security OAuth2 Resource Server — validates JWT tokens                                      |
| Frontend  | `keycloak-angular` adapter — Authorization Code + PKCE flow                                        |
| API calls | `KeycloakBearerInterceptor` (class-based, from keycloak-angular) attaches `Authorization: Bearer`  |
| 401 / 403 | `authInterceptor` (functional) — 401 triggers re-login, 403 shows notification + redirects         |
| HTTP errors | `errorInterceptor` (functional) — maps other status codes to user-friendly snackbar notifications |
| Guards    | `authGuard` — redirects to Keycloak login; `roleGuard` — checks `route.data['roles']`             |

---

## Security Testing Tools

Multi-layer security scanning to detect vulnerabilities across code, dependencies, containers, and runtime.

| Tool                       | Type                                        | What it scans                                            |
|----------------------------|---------------------------------------------|----------------------------------------------------------|
| **Trivy**                  | Container & dependency scanner              | Docker images, OS packages, Java/npm dependencies (CVEs) |
| **Checkmarx (SAST)**       | Static Application Security Testing         | Source code for injection flaws, XSS, insecure patterns  |
| **OWASP ZAP**              | Dynamic Application Security Testing (DAST) | Running application for OWASP Top 10 vulnerabilities     |
| **OWASP Dependency-Check** | Software Composition Analysis (SCA)         | Maven & npm dependencies for known CVEs                  |
| **SonarCloud**             | Code quality & security (hosted)            | Bugs, code smells, security hotspots, coverage           |
| **Snyk**                   | Open source vulnerability scanner           | Dependencies, container images, IaC (Terraform)          |
| **Checkov**                | Infrastructure as Code security             | Terraform misconfigurations, compliance violations       |

### Running Security Scans

```bash
# Container scanning with Trivy
trivy image mini-aliexpress-backend:latest
trivy image frontend:latest
trivy fs --security-checks vuln,config .

# OWASP Dependency-Check (Maven)
cd backend
./mvnw org.owasp:dependency-check-maven:check

# OWASP Dependency-Check (npm)
cd frontend
npm audit

# OWASP ZAP (DAST)
docker run --rm -t zaproxy/zap-stable zap-baseline.py \
  -t http://localhost:8080 -r zap-report.html

# SonarCloud analysis (runs automatically in CI via GitHub Actions)
# Manual trigger: uses sonar-project.properties at repo root
# See .github/workflows/ci.yml for the full pipeline

# Checkov (Terraform IaC)
checkov -d infra/terraform/

# Snyk
snyk test --all-projects
snyk container test mini-aliexpress-backend:latest
snyk iac test infra/terraform/
```

### Makefile Shortcuts

```bash
make security-scan        # Run OWASP + Trivy scans
make sonar                # Run SonarCloud analysis
```
