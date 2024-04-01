terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.97.1"
    }
  }

  required_version = ">= 1.7.0"
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "learn_azure_terraform_rg" {
  name     = "rg-learn-azure-terraform-1"
  location = "eastus"
}

resource "azurerm_storage_account" "learn_azure_terraform" {
  name                     = "learnazureterraform1"
  location                 = azurerm_resource_group.learn_azure_terraform_rg.location

  account_replication_type = "LRS"
  account_tier             = "Standard"
  account_kind             = "StorageV2"
  resource_group_name      = azurerm_resource_group.learn_azure_terraform_rg.name

  static_website {
    index_document = "index.html"
  }
}
