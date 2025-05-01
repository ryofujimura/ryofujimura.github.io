from flask import Blueprint
from . import routes

bp = Blueprint("project1", __name__, template_folder="templates", static_folder="static")

# Register routes from routes.py
routes.register(bp) 