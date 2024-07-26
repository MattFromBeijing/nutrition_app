from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, origins=['http://localhost:3000'], supports_credentials=True)
    app.config['SECRET_KEY'] = 'powerkids!23'

    from .routes import routes

    app.register_blueprint(routes, url_prefix='/')

    return app