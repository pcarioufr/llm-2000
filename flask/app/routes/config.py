import flask
from flask import current_app as app
from app.logs import log
from app.services.chat_service import StatefulChatService
from .auth import auth

from app.services.llm_service import LLMService


def _create_config_response(model=None, prompt=None, status="success"):
    """Helper function to create consistent config responses."""
    return flask.jsonify({
        "status": status,
        "model": model,
        "prompt": prompt
    })


@app.route("/ui/config", methods=['GET', 'POST'])
def config():
    """Endpoint for managing chat configuration (model and prompt)."""
    try:
        # Authenticate user
        user = auth()
        
        if flask.request.method == 'GET':
            # For GET requests, check if config exists
            if not StatefulChatService.exists(user.user_id):
                return _create_config_response(), 200
                
            # Config exists, load and return it
            chat_service = StatefulChatService(user)
            return _create_config_response(
                model=chat_service.config['model'],
                prompt=chat_service.config['prompt']
            ), 200
            
        # Handle POST request
        request_data = flask.request.get_json()
        if not request_data:
            return flask.jsonify({"error": "No data provided"}), 400
            
        model = request_data.get('model')
        prompt = request_data.get('prompt')
        
        # Validate input
        if model is not None and not model.strip():
            return flask.jsonify({"error": "Model cannot be empty"}), 400
        
        try:
            if StatefulChatService.exists(user.user_id):
                # Update existing config
                chat_service = StatefulChatService(user)
                config = chat_service.set_config(model=model, prompt=prompt)
            else:
                # Create new service with config
                chat_service = StatefulChatService.create(user, model=model, prompt=prompt)
                config = chat_service.config
                
            return _create_config_response(
                model=config['model'],
                prompt=config['prompt']
            ), 200
            
        except ValueError as e:
            return flask.jsonify({"error": str(e)}), 400
            
    except Exception as e:
        log.error(f"Error in config endpoint: {str(e)}")
        return flask.jsonify({"error": str(e)}), 500

@app.route("/ui/models", methods=['GET'])
def models():
    """Endpoint for getting available models."""
    try:
        models = LLMService.get_available_models()
        return flask.jsonify({"status": "success", "models": models}), 200
    except ValueError as e:
        log.error(f"Error getting models: {str(e)}")
        return flask.jsonify({
            "error": str(e)
        }), 500
    except Exception as e:
        log.error(f"Unexpected error getting models: {str(e)}")
        return flask.jsonify({
            "error": "Failed to get models"
        }), 500
    
    
@app.route("/ui/prompt/default", methods=['GET'])
def default_prompt():
    """Endpoint for getting the default prompt."""
    try:
        with open('/flask/default_prompt.txt', 'r') as f:
            default_prompt = f.read().strip()
        return flask.jsonify({
            "status": "success",
            "prompt": default_prompt
        }), 200
    except Exception as e:
        log.error(f"Error getting default prompt: {str(e)}")
        return flask.jsonify({
            "error": "Failed to load default prompt",
            "prompt": "You are a helpful AI assistant."
        }), 500 