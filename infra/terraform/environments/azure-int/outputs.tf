locals {
  fqdn = coalesce(azurerm_public_ip.this.fqdn, "${var.project}-int.${var.location}.cloudapp.azure.com")
}

output "vm_public_ip" {
  description = "Public IP address of the INT VM"
  value       = azurerm_public_ip.this.ip_address
}

output "vm_fqdn" {
  description = "VM fully qualified domain name"
  value       = local.fqdn
}

output "frontend_url" {
  description = "Frontend URL"
  value       = "http://${local.fqdn}"
}

output "backend_url" {
  description = "Backend API URL"
  value       = "http://${local.fqdn}:8080"
}

output "keycloak_url" {
  description = "Keycloak URL"
  value       = "http://${local.fqdn}:8180"
}

output "kafka_ui_url" {
  description = "Kafka UI URL"
  value       = "http://${local.fqdn}:9090"
}

output "minio_console_url" {
  description = "Minio Console URL"
  value       = "http://${local.fqdn}:9001"
}
