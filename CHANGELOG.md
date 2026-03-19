# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-01

### Added

- Project scaffolding with Spring Boot 3.5 backend and Angular 18 frontend
- Hexagonal architecture (Ports & Adapters) for the backend
- Feature-based modular architecture for the frontend
- Docker Compose local development environment (PostgreSQL, Kafka, Minio, Keycloak)
- Minikube Helm chart for local Kubernetes deployment
- Azure AKS Terraform + Helm deployment profile
- Azure PaaS (no Kubernetes) Terraform deployment profile
- Keycloak realm configuration with roles (`ROLE_USER`, `ROLE_SELLER`, `ROLE_ADMIN`)
- Liquibase database migration setup
- SpringDoc OpenAPI / Swagger UI integration
- Makefile for project orchestration
- IntelliJ IDEA shared run configurations
- Comprehensive testing strategy (unit, integration, BDD, performance, security)
- Multi-stage Dockerfiles for backend and frontend
- Terraform modules: AKS, PostgreSQL, Blob Storage, Event Hubs, Keycloak VM, Networking, Container Registry
