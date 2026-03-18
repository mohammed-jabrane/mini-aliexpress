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

variable "postgresql_version" {
  description = "PostgreSQL major version"
  type        = string
  default     = "16"
}

variable "admin_username" {
  description = "Administrator login"
  type        = string
  default     = "aliexpress"
}

variable "admin_password" {
  description = "Administrator password"
  type        = string
  sensitive   = true
}

variable "subnet_id" {
  description = "Delegated subnet ID"
  type        = string
}

variable "private_dns_zone_id" {
  description = "Private DNS zone ID"
  type        = string
}

variable "database_name" {
  description = "Application database name"
  type        = string
  default     = "mini_aliexpress"
}

variable "storage_mb" {
  description = "Storage size in MB"
  type        = number
  default     = 32768
}

variable "sku_name" {
  description = "Server SKU"
  type        = string
  default     = "B_Standard_B1ms"
}

variable "availability_zone" {
  description = "Availability zone"
  type        = string
  default     = "1"
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
