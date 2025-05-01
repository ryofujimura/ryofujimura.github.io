from flask import render_template
from .utils import greet

def register(bp):
    @bp.route("/")
    def home():
        return render_template("home.html", msg=greet()) 