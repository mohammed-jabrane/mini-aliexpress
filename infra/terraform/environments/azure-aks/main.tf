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
    key                  = "azure-aks.terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

# ── Resource Group ───────────────────────────────────────────
resource "azurerm_resource_group" "this" {
  name     = "${var.project}-aks-rg"
  location = var.location
  tags     = var.tags
}

# ── Networking ───────────────────────────────────────────────
module "networking" {
  source = "../../modules/networking"

  project             = var.project
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name
  create_aks_subnet   = true
  tags                = var.tags
}

# ── Container Registry (ACR) ────────────────────────────────
module "acr" {
  source = "../../modules/container-registry"

  project             = var.project
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name
  tags                = var.tags
}

# ── AKS Cluster ──────────────────────────────────────────────
module "aks" {
  source = "../../modules/aks"

  project             = var.project
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name
  subnet_id           = module.networking.aks_subnet_id
  acr_id              = module.acr.acr_id
  kubernetes_version  = var.kubernetes_version
  node_count          = var.node_count
  node_vm_size        = var.node_vm_size
  tags                = var.tags
}
