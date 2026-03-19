output "vm_public_ip" {
  description = "Public IP address of the INT VM"
  value       = azurerm_public_ip.this.ip_address
}

output "frontend_url" {
  description = "Frontend URL"
  value       = "http://${azurerm_public_ip.this.ip_address}"
}

output "backend_url" {
  description = "Backend API URL"
  value       = "http://${azurerm_public_ip.this.ip_address}:8080"
}

output "keycloak_url" {
  description = "Keycloak URL"
  value       = "http://${azurerm_public_ip.this.ip_address}:8180"
}

output "kafka_ui_url" {
  description = "Kafka UI URL"
  value       = "http://${azurerm_public_ip.this.ip_address}:9090"
}

output "minio_console_url" {
  description = "Minio Console URL"
  value       = "http://${azurerm_public_ip.this.ip_address}:9001"
}
