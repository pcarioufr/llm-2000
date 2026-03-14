
terraform {

  backend local {} 

  required_providers {

    datadog = {
      source  = "DataDog/datadog"
      version = "~> 3.80.0"
    }

  }
}

provider "datadog" {
  api_key = var.dd_api_key
  app_key = var.dd_app_key
  api_url = "https://api.${var.dd_site}"
}
