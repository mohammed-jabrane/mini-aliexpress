output "public_ip" {
  value = azurerm_public_ip.keycloak.ip_address
}

output "keycloak_url" {
  value = "http://${azurerm_public_ip.keycloak.ip_address}:8080"
}
