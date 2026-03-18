variable "project" {
  description = "Project name prefix"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "resource_group_name" {
  description = "Resource group name"
  type        = string
}

variable "vnet_address_space" {
  description = "VNet address space"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "aks_subnet_prefix" {
  description = "AKS subnet CIDR"
  type        = string
  default     = "10.0.1.0/24"
}

variable "pg_subnet_prefix" {
  description = "PostgreSQL subnet CIDR"
  type        = string
  default     = "10.0.2.0/24"
}

variable "app_service_subnet_prefix" {
  description = "App Service subnet CIDR"
  type        = string
  default     = "10.0.3.0/24"
}

variable "create_aks_subnet" {
  description = "Create AKS subnet"
  type        = bool
  default     = false
}

variable "create_app_service_subnet" {
  description = "Create App Service subnet"
  type        = bool
  default     = false
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
