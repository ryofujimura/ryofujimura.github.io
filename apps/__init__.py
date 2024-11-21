from flask import Flask
from apps.main.views import main
from apps.app1.views import app1
from apps.app2.views import app2
# more projects... add 
# from app.app3.views import app3

def create_app():
    app = Flask(__name__)

    # Register Blueprints
    app.register_blueprint(main)
    app.register_blueprint(app1, url_prefix="/app1")
    app.register_blueprint(app2, url_prefix="/app2")
    # more projects... add
    # app.register_blueprint(app3, url_prefix="/app3")

    return app
