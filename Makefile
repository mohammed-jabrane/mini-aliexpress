# ============================================================
# Mini AliExpress — Project Makefile
# ============================================================
# Usage:
#   make all          → Start everything (infra + backend + frontend)
#   make infra        → Start Docker Compose services only
#   make backend      → Start Spring Boot backend only
#   make frontend     → Start Angular frontend only
#   make stop         → Stop everything
#   make clean        → Stop + remove volumes + clean builds
#   make test         → Run all tests
#   make help         → Show all targets
# ============================================================

.PHONY: all infra backend frontend stop clean test help
.PHONY: infra-up infra-down infra-logs infra-ps
.PHONY: backend-build backend-run backend-test backend-clean
.PHONY: frontend-install frontend-run frontend-test frontend-build frontend-clean
.PHONY: test-unit test-integration test-cucumber test-performance
.PHONY: security-scan docker-build

DOCKER_COMPOSE = docker compose -f infra/docker/local/docker-compose.yml --env-file infra/docker/local/.env
MVN = cd backend && ./mvnw
NG = cd frontend && npx ng

# ── Colors ───────────────────────────────────
CYAN  = \033[36m
GREEN = \033[32m
RESET = \033[0m

# ==============================================================
# Main targets
# ==============================================================

## Start everything (infra + backend + frontend)
all: infra backend frontend

## Stop everything
stop: infra-down
	@echo "$(GREEN)All services stopped.$(RESET)"

## Stop + remove volumes + clean builds
clean: infra-down backend-clean frontend-clean
	@echo "$(GREEN)Everything cleaned.$(RESET)"

# ==============================================================
# Infrastructure (Docker Compose)
# ==============================================================

## Start Docker Compose infrastructure
infra: infra-up
	@echo "$(GREEN)Infrastructure is up.$(RESET)"

infra-up:
	@echo "$(CYAN)Starting infrastructure services...$(RESET)"
	$(DOCKER_COMPOSE) up -d

## Stop Docker Compose infrastructure
infra-down:
	@echo "$(CYAN)Stopping infrastructure services...$(RESET)"
	$(DOCKER_COMPOSE) down

## Stop + remove volumes
infra-clean:
	@echo "$(CYAN)Stopping infrastructure + removing volumes...$(RESET)"
	$(DOCKER_COMPOSE) down -v

## Show infrastructure logs
infra-logs:
	$(DOCKER_COMPOSE) logs -f

## Show infrastructure status
infra-ps:
	$(DOCKER_COMPOSE) ps

# ==============================================================
# Backend (Spring Boot)
# ==============================================================

## Build backend JAR
backend-build:
	@echo "$(CYAN)Building backend...$(RESET)"
	$(MVN) package -DskipTests -B

## Start backend (Spring Boot)
backend: backend-run

backend-run:
	@echo "$(CYAN)Starting backend...$(RESET)"
	$(MVN) spring-boot:run -Dspring-boot.run.profiles=local &

## Run backend unit tests
backend-test:
	@echo "$(CYAN)Running backend tests...$(RESET)"
	$(MVN) test

## Clean backend build artifacts
backend-clean:
	@echo "$(CYAN)Cleaning backend...$(RESET)"
	$(MVN) clean -q

# ==============================================================
# Frontend (Angular)
# ==============================================================

## Install frontend dependencies
frontend-install:
	@echo "$(CYAN)Installing frontend dependencies...$(RESET)"
	cd frontend && npm install

## Start frontend dev server
frontend: frontend-run

frontend-run:
	@echo "$(CYAN)Starting frontend...$(RESET)"
	$(NG) serve &

## Build frontend for production
frontend-build:
	@echo "$(CYAN)Building frontend...$(RESET)"
	$(NG) build --configuration production

## Run frontend unit tests
frontend-test:
	@echo "$(CYAN)Running frontend tests...$(RESET)"
	$(NG) test --no-watch --code-coverage

## Clean frontend build artifacts
frontend-clean:
	@echo "$(CYAN)Cleaning frontend...$(RESET)"
	rm -rf frontend/dist frontend/.angular/cache

# ==============================================================
# Testing
# ==============================================================

## Run all tests (backend + frontend)
test: test-unit

## Run all unit tests
test-unit: backend-test frontend-test

## Run integration tests (Testcontainers — requires Docker)
test-integration:
	@echo "$(CYAN)Running integration tests...$(RESET)"
	$(MVN) verify -Pintegration-tests

## Run Cucumber BDD tests
test-cucumber:
	@echo "$(CYAN)Running Cucumber tests...$(RESET)"
	$(MVN) verify -Pcucumber

## Run Gatling performance tests
test-performance:
	@echo "$(CYAN)Running Gatling performance tests...$(RESET)"
	$(MVN) gatling:test

## Run PITest mutation tests
test-mutation:
	@echo "$(CYAN)Running PITest mutation tests...$(RESET)"
	$(MVN) pitest:mutationCoverage

# ==============================================================
# Security & Quality
# ==============================================================

## Run all security scans
security-scan: security-owasp security-trivy

## OWASP Dependency-Check
security-owasp:
	@echo "$(CYAN)Running OWASP Dependency-Check...$(RESET)"
	$(MVN) dependency-check:check

## Trivy container scan
security-trivy:
	@echo "$(CYAN)Scanning Docker images with Trivy...$(RESET)"
	trivy image mini-aliexpress-backend:latest
	trivy image mini-aliexpress-frontend:latest

## SonarQube analysis
sonar:
	@echo "$(CYAN)Running SonarQube analysis...$(RESET)"
	$(MVN) sonar:sonar

# ==============================================================
# Docker Build
# ==============================================================

## Build Docker images
docker-build:
	@echo "$(CYAN)Building Docker images...$(RESET)"
	docker build -t mini-aliexpress-backend:latest backend/
	docker build -t mini-aliexpress-frontend:latest frontend/

# ==============================================================
# Help
# ==============================================================

## Show available targets
help:
	@echo ""
	@echo "$(CYAN)Mini AliExpress — Available targets:$(RESET)"
	@echo ""
	@echo "  $(GREEN)Main$(RESET)"
	@echo "    make all                  Start everything (infra + backend + frontend)"
	@echo "    make stop                 Stop everything"
	@echo "    make clean                Stop + remove volumes + clean builds"
	@echo ""
	@echo "  $(GREEN)Infrastructure$(RESET)"
	@echo "    make infra                Start Docker Compose services"
	@echo "    make infra-down           Stop Docker Compose services"
	@echo "    make infra-clean          Stop + remove volumes"
	@echo "    make infra-logs           Tail infrastructure logs"
	@echo "    make infra-ps             Show running containers"
	@echo ""
	@echo "  $(GREEN)Backend$(RESET)"
	@echo "    make backend              Start Spring Boot backend"
	@echo "    make backend-build        Build backend JAR"
	@echo "    make backend-test         Run backend unit tests"
	@echo "    make backend-clean        Clean build artifacts"
	@echo ""
	@echo "  $(GREEN)Frontend$(RESET)"
	@echo "    make frontend             Start Angular dev server"
	@echo "    make frontend-install     Install npm dependencies"
	@echo "    make frontend-build       Build for production"
	@echo "    make frontend-test        Run frontend unit tests"
	@echo "    make frontend-clean       Clean build artifacts"
	@echo ""
	@echo "  $(GREEN)Testing$(RESET)"
	@echo "    make test                 Run all unit tests"
	@echo "    make test-integration     Run Testcontainers integration tests"
	@echo "    make test-cucumber        Run Cucumber BDD tests"
	@echo "    make test-performance     Run Gatling performance tests"
	@echo "    make test-mutation        Run PITest mutation tests"
	@echo ""
	@echo "  $(GREEN)Security & Quality$(RESET)"
	@echo "    make security-scan        Run OWASP + Trivy scans"
	@echo "    make sonar                Run SonarQube analysis"
	@echo ""
	@echo "  $(GREEN)Docker$(RESET)"
	@echo "    make docker-build         Build backend + frontend Docker images"
	@echo ""
