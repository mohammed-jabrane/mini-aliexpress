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

variable "kubernetes_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.30"
}

variable "node_count" {
  description = "Default node count"
  type        = number
  default     = 2
}

variable "node_vm_size" {
  description = "VM size for nodes"
  type        = string
  default     = "Standard_D2s_v3"
}

variable "subnet_id" {
  description = "Subnet ID for AKS nodes"
  type        = string
}

variable "auto_scaling_enabled" {
  description = "Enable cluster auto-scaler"
  type        = bool
  default     = true
}

variable "min_node_count" {
  description = "Minimum node count"
  type        = number
  default     = 2
}

variable "max_node_count" {
  description = "Maximum node count"
  type        = number
  default     = 5
}

variable "service_cidr" {
  description = "Kubernetes service CIDR"
  type        = string
  default     = "10.1.0.0/16"
}

variable "dns_service_ip" {
  description = "Kubernetes DNS service IP"
  type        = string
  default     = "10.1.0.10"
}

variable "acr_id" {
  description = "ACR resource ID for AcrPull role assignment"
  type        = string
  default     = null
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
