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

resource "azurerm_storage_share" "learn_azure_terraform" {
  name  = "sh-learn-azure-terraform"
  quota = 2

  storage_account_name = azurerm_storage_account.learn_azure_terraform.name
}

resource "azurerm_service_plan" "learn_azure_terraform_plan" {
  name     = "asp-learn-azure-terraform"
  location = azurerm_resource_group.learn_azure_terraform_rg.location

  os_type  = "Windows"
  sku_name = "Y1"

  resource_group_name = azurerm_resource_group.learn_azure_terraform_rg.name
}

resource "azurerm_application_insights" "learn_azure_terraform" {
  name             = "appins-learn-azure-terraform"
  application_type = "web"
  location         =  azurerm_resource_group.learn_azure_terraform_rg.location

  resource_group_name = azurerm_resource_group.learn_azure_terraform_rg.name
}

resource "azurerm_windows_function_app" "learn_azure_terraform_service" {
  name     = "fa-learn-azure-terraform-0"
  location = azurerm_resource_group.learn_azure_terraform_rg.location

  service_plan_id     = azurerm_service_plan.learn_azure_terraform_plan.id
  resource_group_name = azurerm_resource_group.learn_azure_terraform_rg.name

  storage_account_name       = azurerm_storage_account.learn_azure_terraform.name
  storage_account_access_key = azurerm_storage_account.learn_azure_terraform.primary_access_key

  functions_extension_version = "~4"
  builtin_logging_enabled     = false

  site_config {
    always_on = false

    application_insights_key               = azurerm_application_insights.learn_azure_terraform.instrumentation_key
    application_insights_connection_string = azurerm_application_insights.learn_azure_terraform.connection_string

    # For production systems set this to false, but consumption plan supports only 32bit workers
    use_32_bit_worker = true

    # Enable function invocations from Azure Portal.
    cors {
      allowed_origins = [
        "https://portal.azure.com",
        "https://learnazureterraform1.z13.web.core.windows.net"
      ]
    }

    application_stack {
      node_version = "~16"
    }
  }

  app_settings = {
    WEBSITE_CONTENTAZUREFILECONNECTIONSTRING = azurerm_storage_account.learn_azure_terraform.primary_connection_string
    WEBSITE_CONTENTSHARE                     = azurerm_storage_share.learn_azure_terraform.name
  }

  # The app settings changes cause downtime on the Function App. e.g. with Azure Function App Slots
  # Therefore it is better to ignore those changes and manage app settings separately off the Terraform.
  lifecycle {
    ignore_changes = [
      app_settings,
      site_config["application_stack"], // workaround for a bug when azure just "kills" your app
      tags["hidden-link: /app-insights-instrumentation-key"],
      tags["hidden-link: /app-insights-resource-id"],
      tags["hidden-link: /app-insights-conn-string"]
    ]
  }
}

resource "azurerm_windows_function_app_slot" "learn_azure_terraform" {
  name                       = "staging"
  function_app_id      = azurerm_windows_function_app.learn_azure_terraform_service.id
  storage_account_name = azurerm_storage_account.learn_azure_terraform.name

  site_config {
    always_on = azurerm_windows_function_app.learn_azure_terraform_service.site_config[0].always_on

    application_insights_key               = azurerm_windows_function_app.learn_azure_terraform_service.site_config[0].application_insights_key
    application_insights_connection_string = azurerm_windows_function_app.learn_azure_terraform_service.site_config[0].application_insights_connection_string

    use_32_bit_worker = azurerm_windows_function_app.learn_azure_terraform_service.site_config[0].use_32_bit_worker

    cors {
      allowed_origins = azurerm_windows_function_app.learn_azure_terraform_service.site_config[0].cors[0].allowed_origins
    }

    application_stack {
      node_version = azurerm_windows_function_app.learn_azure_terraform_service.site_config[0].application_stack[0].node_version
    }
  }

  app_settings = azurerm_windows_function_app.learn_azure_terraform_service.app_settings

  lifecycle {
    ignore_changes = [
      app_settings,
      site_config["application_stack"], // workaround for a bug when azure just "kills" your app
      tags["hidden-link: /app-insights-instrumentation-key"],
      tags["hidden-link: /app-insights-resource-id"],
      tags["hidden-link: /app-insights-conn-string"]
    ]
  }
}
