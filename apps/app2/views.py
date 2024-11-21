from flask import Blueprint, render_template

app2 = Blueprint('app2', __name__, template_folder='templates')

@app2.route('/')
def app2_home():
    return render_template('app2/index.html')
