output "vnet_id" {
  value = azurerm_virtual_network.this.id
}

output "vnet_name" {
  value = azurerm_virtual_network.this.name
}

output "aks_subnet_id" {
  value = var.create_aks_subnet ? azurerm_subnet.aks[0].id : null
}

output "postgresql_subnet_id" {
  value = azurerm_subnet.postgresql.id
}

output "app_service_subnet_id" {
  value = var.create_app_service_subnet ? azurerm_subnet.app_service[0].id : null
}

output "postgresql_dns_zone_id" {
  value = azurerm_private_dns_zone.postgresql.id
}
