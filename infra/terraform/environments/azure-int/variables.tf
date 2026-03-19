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

variable "ssh_public_key" {
  description = "SSH public key for the VM"
  type        = string
}

variable "postgres_password" {
  description = "PostgreSQL password"
  type        = string
  sensitive   = true
}

variable "keycloak_admin_password" {
  description = "Keycloak admin console password"
  type        = string
  sensitive   = true
}

variable "minio_root_password" {
  description = "Minio root password"
  type        = string
  sensitive   = true
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default = {
    project     = "mini-aliexpress"
    environment = "int"
    managed_by  = "terraform"
  }
}
