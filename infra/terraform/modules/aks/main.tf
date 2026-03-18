resource "azurerm_kubernetes_cluster" "this" {
  name                = "${var.project}-aks"
  location            = var.location
  resource_group_name = var.resource_group_name
  dns_prefix          = var.project
  kubernetes_version  = var.kubernetes_version

  default_node_pool {
    name                = "default"
    node_count          = var.node_count
    vm_size             = var.node_vm_size
    vnet_subnet_id      = var.subnet_id
    auto_scaling_enabled = var.auto_scaling_enabled
    min_count           = var.auto_scaling_enabled ? var.min_node_count : null
    max_count           = var.auto_scaling_enabled ? var.max_node_count : null
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    network_policy    = "calico"
    load_balancer_sku = "standard"
    service_cidr      = var.service_cidr
    dns_service_ip    = var.dns_service_ip
  }

  oidc_issuer_enabled       = true
  workload_identity_enabled = true

  tags = var.tags
}

# Attach ACR to AKS
resource "azurerm_role_assignment" "aks_acr" {
  count                = var.acr_id != null ? 1 : 0
  principal_id         = azurerm_kubernetes_cluster.this.kubelet_identity[0].object_id
  role_definition_name = "AcrPull"
  scope                = var.acr_id
}
