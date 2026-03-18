output "resource_group_name" {
  value = azurerm_resource_group.this.name
}

output "postgresql_fqdn" {
  value = module.postgresql.server_fqdn
}

output "blob_storage_endpoint" {
  value = module.blob_storage.primary_blob_endpoint
}

output "event_hubs_namespace" {
  value = module.event_hubs.namespace_name
}

output "acr_login_server" {
  value = module.acr.login_server
}

output "keycloak_url" {
  value = module.keycloak.keycloak_url
}

output "backend_url" {
  value = "https://${azurerm_linux_web_app.backend.default_hostname}"
}

output "frontend_url" {
  value = "https://${azurerm_static_web_app.frontend.default_host_name}"
}
