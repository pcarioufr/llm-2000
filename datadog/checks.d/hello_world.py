"""
Custom Datadog Agent Check - Hello World
Sends a hello world event each time it runs.
"""

import os
import time

try:
    # Try to import from newer Agent versions (6.6.0+)
    from datadog_checks.base import AgentCheck
except ImportError:
    # Fallback for older Agent versions
    from checks import AgentCheck

__version__ = "1.0.0"


class HelloWorldCheck(AgentCheck):
    """
    A simple custom check that sends a hello world event.
    """
    
    def check(self, instance):
        """
        This method is called by the Agent on each check run.
        
        Args:
            instance: Configuration from the YAML file for this instance
        """
        # Get notification email from environment variable
        notif_email = os.getenv('NOTIF_EMAIL', 'user@example.com')
        
        # Send a custom event
        self.event({
            'timestamp': int(time.time()),
            'event_type': 'hello_world_check',
            'msg_title': 'Hello World Check',
            'msg_text': f'Hello from the custom Datadog check! @{notif_email} 👋',
            'aggregation_key': 'hello_world',
            'alert_type': 'info',
            'source_type_name': 'custom_check',
            'tags': ['custom_check:hello_world', 'environment:local'] + instance.get('tags', [])
        })
        
        # Optional: Send a metric as well to verify the check is running
        self.gauge('hello_world.check.run', 1, tags=['custom_check:hello_world'] + instance.get('tags', []))
        
        # Log that the check ran successfully
        self.log.info("Hello World check ran successfully")

