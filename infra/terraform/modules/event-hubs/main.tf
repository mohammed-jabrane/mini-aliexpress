resource "azurerm_eventhub_namespace" "this" {
  name                = "${var.project}-eventhubs"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = var.sku
  capacity            = var.capacity

  tags = var.tags
}

resource "azurerm_eventhub" "topics" {
  for_each = var.topics

  name              = each.key
  namespace_id      = azurerm_eventhub_namespace.this.id
  partition_count   = each.value.partition_count
  message_retention = each.value.message_retention
}

resource "azurerm_eventhub_namespace_authorization_rule" "app" {
  name         = "${var.project}-app-rule"
  namespace_id = azurerm_eventhub_namespace.this.id
  listen       = true
  send         = true
  manage       = false
}
