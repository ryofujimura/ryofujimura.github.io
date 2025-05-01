# Ryo Fuji Projects Hub

This is a Flask-based web application that serves as a hub for various projects.

## Setup and Installation

1. Create a virtual environment (recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use venv\Scripts\activate
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the application:
   ```
   python app.py
   ```

## Project Structure

- `main_app/app.py`: The main Flask application that loads and registers all projects
- `main_app/templates/`: HTML templates for the main application
- `main_app/Projects/`: Directory containing all individual projects
  - Each project has its own app.py file that defines a Blueprint

## Adding New Projects

To add a new project:

1. Create a new directory in the `Projects` folder
2. Create an `app.py` file in the project directory with a Blueprint object named `bp`
3. The Blueprint will be automatically registered by the main application

## Projects Included

- **CyberEdu-Web**: Cybersecurity education web application
- **Whiteboard AI**: AI-powered collaborative whiteboard
- **Tokai Shuttle**: Shuttle service management application
- **Class Scheduler**: Academic class scheduling system 