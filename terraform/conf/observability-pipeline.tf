# Observability Pipelines Worker Configuration
# Using Datadog's native Terraform provider for Observability Pipelines
# Docs: https://registry.terraform.io/providers/DataDog/datadog/latest/docs/resources/observability_pipeline

resource "datadog_observability_pipeline" "llm_2000" {
  name = "LLM-2000 Observability Pipeline"

  config {
    # Sources: Receive data from Datadog Agent
    sources {
      datadog_agent {
        id = "datadog-agent-source"
      }
    }

    # Processors: Empty block (no processing, just pass-through)
    processors {
    }

    # Destinations: Forward to Datadog (logs, metrics, traces)
    destinations {
      datadog_logs {
        id     = "datadog-logs-destination"
        inputs = ["datadog-agent-source"]
      }
    }
  }
}

