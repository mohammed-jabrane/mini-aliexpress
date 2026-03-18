terraform {
  required_version = ">= 1.5"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "mini-aliexpress-tfstate"
    storage_account_name = "minialiexpressstate"
    container_name       = "tfstate"
    key                  = "azure-services.terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

# ── Resource Group ───────────────────────────────────────────
resource "azurerm_resource_group" "this" {
  name     = "${var.project}-services-rg"
  location = var.location
  tags     = var.tags
}

# ── Networking ───────────────────────────────────────────────
module "networking" {
  source = "../../modules/networking"

  project                   = var.project
  location                  = var.location
  resource_group_name       = azurerm_resource_group.this.name
  create_app_service_subnet = true
  tags                      = var.tags
}

# ── Azure Database for PostgreSQL (Flexible Server) ──────────
module "postgresql" {
  source = "../../modules/postgresql"

  project             = var.project
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name
  admin_password      = var.postgresql_admin_password
  subnet_id           = module.networking.postgresql_subnet_id
  private_dns_zone_id = module.networking.postgresql_dns_zone_id
  tags                = var.tags
}

# ── Azure Blob Storage (replaces Minio S3) ───────────────────
module "blob_storage" {
  source = "../../modules/blob-storage"

  project              = var.project
  location             = var.location
  resource_group_name  = azurerm_resource_group.this.name
  cors_allowed_origins = var.cors_allowed_origins
  tags                 = var.tags
}

# ── Azure Event Hubs (replaces Kafka) ────────────────────────
module "event_hubs" {
  source = "../../modules/event-hubs"

  project             = var.project
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name
  topics              = var.event_hub_topics
  tags                = var.tags
}

# ── Container Registry (for App Service images) ─────────────
module "acr" {
  source = "../../modules/container-registry"

  project             = var.project
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name
  tags                = var.tags
}

# ── Keycloak VM ──────────────────────────────────────────────
module "keycloak" {
  source = "../../modules/keycloak-vm"

  project             = var.project
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name
  subnet_id           = module.networking.postgresql_subnet_id
  ssh_public_key      = var.ssh_public_key
  db_host             = module.postgresql.server_fqdn
  db_user             = "aliexpress"
  db_password         = var.postgresql_admin_password
  keycloak_admin_password = var.keycloak_admin_password
  tags                = var.tags
}

# ── App Service Plan ─────────────────────────────────────────
resource "azurerm_service_plan" "this" {
  name                = "${var.project}-plan"
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name
  os_type             = "Linux"
  sku_name            = var.app_service_sku

  tags = var.tags
}

# ── Backend App Service ──────────────────────────────────────
resource "azurerm_linux_web_app" "backend" {
  name                = "${var.project}-backend"
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name
  service_plan_id     = azurerm_service_plan.this.id

  site_config {
    application_stack {
      docker_registry_url      = "https://${module.acr.login_server}"
      docker_registry_username = module.acr.admin_username
      docker_registry_password = module.acr.admin_password
      docker_image_name        = "mini-aliexpress-backend:latest"
    }
  }

  app_settings = {
    SPRING_PROFILES_ACTIVE                        = "azure-services"
    SPRING_DATASOURCE_URL                         = "jdbc:postgresql://${module.postgresql.server_fqdn}:5432/${module.postgresql.database_name}?sslmode=require"
    SPRING_DATASOURCE_USERNAME                    = "aliexpress"
    SPRING_DATASOURCE_PASSWORD                    = var.postgresql_admin_password
    SPRING_CLOUD_AZURE_EVENTHUBS_CONNECTION_STRING = module.event_hubs.connection_string
    AZURE_STORAGE_CONNECTION_STRING               = module.blob_storage.primary_connection_string
    AZURE_STORAGE_BLOB_ENDPOINT                   = module.blob_storage.primary_blob_endpoint
    KEYCLOAK_ISSUER_URI                           = "${module.keycloak.keycloak_url}/realms/mini-aliexpress"
  }

  tags = var.tags
}

# ── Frontend App Service (Static Web App) ────────────────────
resource "azurerm_static_web_app" "frontend" {
  name                = "${var.project}-frontend"
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name
  sku_tier            = "Free"
  sku_size            = "Free"

  tags = var.tags
}
