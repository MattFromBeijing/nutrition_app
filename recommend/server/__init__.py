from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app, origins=['http://client:5000/'], supports_credentials=True)
    app.config['SECRET_KEY'] = os.getenv('FLASK_KEY')

    @app.after_request
    def add_cors_headers(response):
        response.headers.add('Access-Control-Allow-Origin', 'http://client:5000')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    from .routes import routes
    app.register_blueprint(routes, url_prefix='/')

    return app