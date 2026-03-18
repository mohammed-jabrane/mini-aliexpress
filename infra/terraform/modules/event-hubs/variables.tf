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

variable "sku" {
  description = "Event Hubs namespace SKU (Basic, Standard, Premium)"
  type        = string
  default     = "Standard"
}

variable "capacity" {
  description = "Throughput units"
  type        = number
  default     = 1
}

variable "topics" {
  description = "Map of Event Hub topics to create"
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

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
