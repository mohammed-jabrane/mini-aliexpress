resource "azurerm_public_ip" "keycloak" {
  name                = "${var.project}-keycloak-pip"
  location            = var.location
  resource_group_name = var.resource_group_name
  allocation_method   = "Static"
  sku                 = "Standard"

  tags = var.tags
}

resource "azurerm_network_interface" "keycloak" {
  name                = "${var.project}-keycloak-nic"
  location            = var.location
  resource_group_name = var.resource_group_name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.subnet_id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.keycloak.id
  }

  tags = var.tags
}

resource "azurerm_network_security_group" "keycloak" {
  name                = "${var.project}-keycloak-nsg"
  location            = var.location
  resource_group_name = var.resource_group_name

  security_rule {
    name                       = "allow-http"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "8080"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "allow-https"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "8443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  tags = var.tags
}

resource "azurerm_network_interface_security_group_association" "keycloak" {
  network_interface_id      = azurerm_network_interface.keycloak.id
  network_security_group_id = azurerm_network_security_group.keycloak.id
}

resource "azurerm_linux_virtual_machine" "keycloak" {
  name                            = "${var.project}-keycloak-vm"
  resource_group_name             = var.resource_group_name
  location                        = var.location
  size                            = var.vm_size
  admin_username                  = var.vm_admin_username
  disable_password_authentication = true

  admin_ssh_key {
    username   = var.vm_admin_username
    public_key = var.ssh_public_key
  }

  network_interface_ids = [azurerm_network_interface.keycloak.id]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }

  custom_data = base64encode(templatefile("${path.module}/cloud-init.tpl", {
    keycloak_version = var.keycloak_version
    db_host          = var.db_host
    db_name          = "keycloak"
    db_user          = var.db_user
    db_password      = var.db_password
    admin_user       = var.keycloak_admin_user
    admin_password   = var.keycloak_admin_password
  }))

  tags = var.tags
}
