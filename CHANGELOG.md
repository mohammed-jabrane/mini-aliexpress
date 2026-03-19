# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0]

### Added

- Project scaffolding with Spring Boot 3.5 backend and Angular 18 frontend
- Hexagonal architecture (Ports & Adapters) for the backend
- Feature-based modular architecture for the frontend
- Docker Compose local development environment (PostgreSQL, Kafka, Minio, Keycloak)
- IntelliJ IDEA shared run configurations
- Makefile for project orchestration
- SpringDoc OpenAPI / Swagger UI integration
- Multi-stage Dockerfiles for backend and frontend

## [1.0.0]

### Added
- Liquibase database migration setup
- Keycloak realm configuration with roles (`ROLE_USER`, `ROLE_SELLER`, `ROLE_ADMIN`)
- Create UI and integration of Material Design
- Interface for list of Products

## [1.1.0]

### Added
- Comprehensive testing strategy (unit, integration, BDD, performance, security)

## [1.2.0]

### Added
- Minikube Helm chart for local Kubernetes deployment
- Azure AKS Terraform + Helm deployment profile

## [2.0.0]

### Added
- Azure PaaS (no Kubernetes) Terraform deployment profile
- Terraform modules: AKS, PostgreSQL, Blob Storage, Event Hubs, Keycloak VM, Networking, Container Registry


## [2.2.0]

### Added
- Multilanguage plateforme

## [3.0.0]

### Added
- Paiement with card

## [4.0.0]

### Added
- Migration to AWS 