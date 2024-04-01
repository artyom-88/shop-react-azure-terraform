terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.92.0"
    }
  }

  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "learn_azure_rg" {
  name     = "learn-azure-rg"
  location = "westus2"
}

resource "azurerm_storage_account" "learn_azure_storage_account" {
  name                     = "learnazurestorageaccount00"
  location                 = azurerm_resource_group.learn_azure_rg.location

  account_replication_type = "LRS"
  account_tier             = "Standard"
  account_kind             = "StorageV2"
  resource_group_name      = azurerm_resource_group.learn_azure_rg.name

  static_website {
    index_document = "index.html"
  }
}

resource "azurerm_app_service_plan" "learn_azure_service_plan" {
  name                = "learn-azure-functions-service-plan"
  location            = azurerm_resource_group.learn_azure_rg.location
  resource_group_name = azurerm_resource_group.learn_azure_rg.name
  kind                = "Linux"

  sku {
    tier = "Standard"
    size = "S1"
  }
}

resource "azurerm_function_app" "learn_azure_functions_app" {
  name                       = "fa-products-service-sand-ne-001"
  location                   = azurerm_resource_group.learn_azure_rg.location
  resource_group_name        = azurerm_resource_group.learn_azure_rg.name
  app_service_plan_id        = azurerm_app_service_plan.learn_azure_service_plan.id
  storage_account_name       = azurerm_storage_account.learn_azure_storage_account.name
  storage_account_access_key = azurerm_storage_account.learn_azure_storage_account.primary_access_key
}
