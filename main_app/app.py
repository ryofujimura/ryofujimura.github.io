from flask import Flask, render_template
import os
import importlib

app = Flask(__name__)

# Register all subproject Blueprints
projects_path = "projects"
for folder in os.listdir(projects_path):
    if os.path.isdir(os.path.join(projects_path, folder)):
        try:
            mod = importlib.import_module(f"projects.{folder}.app")
            app.register_blueprint(mod.bp, url_prefix=f"/projects/{folder}")
        except Exception as e:
            print(f"Error loading {folder}: {e}")

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True) 