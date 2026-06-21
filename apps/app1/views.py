# app.py
from flask import Blueprint, render_template, Flask, render_template, request, jsonify
from . import scheduler

app1 = Blueprint('app1', __name__, template_folder='templates')  

# app = Flask(__name__)
@app1.route('/')
def index():
    """
    Render the main page with the list of available classes.
    """
    # Fetch all classes from the database to display
    conn = scheduler.get_db_connection()
    classes = conn.execute('SELECT id, class_id FROM class_offered').fetchall()
    conn.close()
    return render_template('app1/index.html', classes=classes)

@app1.route('/generate_schedules', methods=['POST'])
def generate_schedules():
    """
    Handle the generation of schedules based on selected classes and personal schedules.
    """
    data = request.get_json()
    class_ids = data.get('class_ids', [])
    personal_schedule = data.get('personal_schedule', [])
    time_increment = data.get('time_increment', 30)  # Default to 30 if not provided

    # print(f"Data received from client: {data}")
    # print(f"Class IDs: {class_ids}")
    # print(f"Personal Schedule: {personal_schedule}")
    # print(f"Time Increment: {time_increment}")

    # Ensure time_increment is an integer and valid
    try:
        time_increment = int(time_increment)
        if time_increment not in [15, 30, 60, 120]:
            raise ValueError("Invalid time increment selected.")
    except ValueError as ve:
        print(f"Invalid time_increment: {ve}")
        return jsonify({"error": "Invalid time increment selected. Please choose 15, 30, 60, or 120 minutes."}), 400

    # Fetch classes and their sections
    classes = scheduler.fetch_classes(class_ids)

    # Create bitset for personal schedule
    personal_bitset = scheduler.create_personal_bitset(personal_schedule, time_increment)

    # Generate all valid schedules
    schedules = scheduler.generate_schedules(classes, personal_bitset, personal_schedule, time_increment)

    # Prepare data to send back to client
    schedules_data = []
    for schedule in schedules:
        sections = []
        for section in schedule['sections']:
            sections.append({
                'class_id': section['class_id'],
                'class_name': section['class_name'],
                'start_time': section['start_time'],
                'end_time': section['end_time'],
                'days': section['days']
            })
        schedules_data.append({
            'sections': sections,
            'matrix': schedule['matrix']
        })

    # print(f"Schedules Data to be sent to client: {schedules_data}")

    return jsonify(schedules_data)