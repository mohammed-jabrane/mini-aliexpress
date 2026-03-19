packer {
  required_plugins {
    azure = {
      source  = "github.com/hashicorp/azure"
      version = "~> 2.0"
    }
  }
}

# ── Variables ────────────────────────────────────────────────
variable "subscription_id" {
  type = string
}

variable "client_id" {
  type = string
}

variable "client_secret" {
  type      = string
  sensitive = true
}

variable "tenant_id" {
  type = string
}

variable "location" {
  type    = string
  default = "francecentral"
}

variable "resource_group" {
  type    = string
  default = "mini-aliexpress-packer-rg"
}

variable "image_name" {
  type    = string
  default = "mini-aliexpress-int-docker"
}

# ── Source ───────────────────────────────────────────────────
source "azure-arm" "ubuntu" {
  subscription_id = var.subscription_id
  client_id       = var.client_id
  client_secret   = var.client_secret
  tenant_id       = var.tenant_id

  managed_image_resource_group_name = var.resource_group
  managed_image_name                = var.image_name

  os_type         = "Linux"
  image_publisher = "Canonical"
  image_offer     = "0001-com-ubuntu-server-jammy"
  image_sku       = "22_04-lts"

  location = var.location
  vm_size  = "Standard_B2s"

  azure_tags = {
    project    = "mini-aliexpress"
    managed_by = "packer"
  }
}

# ── Build ────────────────────────────────────────────────────
build {
  sources = ["source.azure-arm.ubuntu"]

  provisioner "shell" {
    script = "scripts/install-docker.sh"
  }

  provisioner "shell" {
    execute_command = "chmod +x {{ .Path }}; {{ .Vars }} sudo {{ .Path }}"
    inline = [
      "/usr/sbin/waagent -force -deprovision+user && sync"
    ]
  }
}
