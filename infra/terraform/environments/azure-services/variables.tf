variable "subscription_id" {
  description = "Azure subscription ID"
  type        = string
}

variable "project" {
  description = "Project name prefix"
  type        = string
  default     = "mini-aliexpress"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "francecentral"
}

variable "postgresql_admin_password" {
  description = "PostgreSQL administrator password"
  type        = string
  sensitive   = true
}

variable "keycloak_admin_password" {
  description = "Keycloak admin console password"
  type        = string
  sensitive   = true
}

variable "ssh_public_key" {
  description = "SSH public key for the Keycloak VM"
  type        = string
}

variable "cors_allowed_origins" {
  description = "CORS allowed origins for Blob Storage"
  type        = list(string)
  default     = ["*"]
}

variable "event_hub_topics" {
  description = "Event Hub topics"
  type = map(object({
    partition_count   = number
    message_retention = number
  }))
  default = {
    "order-events" = {
      partition_count   = 2
      message_retention = 7
    }
    "product-events" = {
      partition_count   = 2
      message_retention = 7
    }
    "payment-events" = {
      partition_count   = 2
      message_retention = 7
    }
  }
}

variable "app_service_sku" {
  description = "App Service Plan SKU"
  type        = string
  default     = "B1"
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default = {
    project     = "mini-aliexpress"
    environment = "azure-services"
    managed_by  = "terraform"
  }
}
