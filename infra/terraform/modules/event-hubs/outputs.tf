output "namespace_id" {
  value = azurerm_eventhub_namespace.this.id
}

output "namespace_name" {
  value = azurerm_eventhub_namespace.this.name
}

output "connection_string" {
  value     = azurerm_eventhub_namespace_authorization_rule.app.primary_connection_string
  sensitive = true
}
