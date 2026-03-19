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
  default     = "westeurope"
}

variable "kubernetes_version" {
  description = "AKS Kubernetes version"
  type        = string
  default     = "1.30"
}

variable "node_count" {
  description = "AKS default node count"
  type        = number
  default     = 2
}

variable "node_vm_size" {
  description = "AKS node VM size"
  type        = string
  default     = "Standard_D2s_v3"
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default = {
    project     = "mini-aliexpress"
    environment = "aks"
    managed_by  = "terraform"
  }
}
