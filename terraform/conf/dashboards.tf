resource "datadog_dashboard" "webapp_performance" {
  title       = "LLM-2000 Webapp Performance"
  description = "Basic performance insights for the Flask webapp"
  layout_type = "ordered"

  # Request throughput
  widget {
    timeseries_definition {
      title = "Request Throughput"
      request {
        formula {
          formula_expression = "query1"
        }
        query {
          metric_query {
            name        = "query1"
            data_source = "metrics"
            query       = "sum:trace.flask.request.hits{service:flask,env:${var.dd_env}}.as_count()"
          }
        }
        display_type = "bars"
      }
    }
  }

  # Request latency percentiles
  widget {
    timeseries_definition {
      title = "Request Latency (p50 / p95 / p99)"
      request {
        formula {
          formula_expression = "query1"
          alias              = "p50"
        }
        query {
          metric_query {
            name        = "query1"
            data_source = "metrics"
            query       = "p50:trace.flask.request{service:flask,env:${var.dd_env}}"
          }
        }
        display_type = "line"
      }
      request {
        formula {
          formula_expression = "query2"
          alias              = "p95"
        }
        query {
          metric_query {
            name        = "query2"
            data_source = "metrics"
            query       = "p95:trace.flask.request{service:flask,env:${var.dd_env}}"
          }
        }
        display_type = "line"
      }
      request {
        formula {
          formula_expression = "query3"
          alias              = "p99"
        }
        query {
          metric_query {
            name        = "query3"
            data_source = "metrics"
            query       = "p99:trace.flask.request{service:flask,env:${var.dd_env}}"
          }
        }
        display_type = "line"
      }
    }
  }

  # Error rate
  widget {
    timeseries_definition {
      title = "Error Rate (%)"
      request {
        formula {
          formula_expression = "(query1 / query2) * 100"
          alias              = "Error rate"
        }
        query {
          metric_query {
            name        = "query1"
            data_source = "metrics"
            query       = "sum:trace.flask.request.errors{service:flask,env:${var.dd_env}}.as_count()"
          }
        }
        query {
          metric_query {
            name        = "query2"
            data_source = "metrics"
            query       = "sum:trace.flask.request.hits{service:flask,env:${var.dd_env}}.as_count()"
          }
        }
        display_type = "line"
      }
    }
  }

  # Top endpoints by hits
  widget {
    toplist_definition {
      title = "Top Endpoints by Hits"
      request {
        formula {
          formula_expression = "query1"
        }
        query {
          metric_query {
            name        = "query1"
            data_source = "metrics"
            query       = "sum:trace.flask.request.hits{service:flask,env:${var.dd_env}} by {resource_name}.as_count()"
          }
        }
      }
    }
  }
}
