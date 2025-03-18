import os, requests, json
from flask import Flask, render_template, request, redirect, url_for, flash, session
from models import db, Profile, Experience, Tag, ExperienceType
from sqlalchemy import func
from functools import wraps
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Secret key for sessions and flash messages
app.secret_key = os.environ.get('SECRET_KEY', 'dev_key_for_development')

# Configure SQLite database (relative path)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///local_database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Admin credentials - in production, use environment variables
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'password')

# Ensure data directory exists
DATA_DIR = Path('data')
DATA_DIR.mkdir(exist_ok=True)

# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            flash('Please log in to access this page', 'danger')
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function

def get_or_create_experience_type(name):
    """
    Helper to retrieve (or create) an ExperienceType by name.
    """
    et = ExperienceType.query.filter_by(name=name).first()
    if not et:
        et = ExperienceType(name=name)
        db.session.add(et)
        db.session.commit()
    return et

def get_or_create_tag(tag_name):
    """
    Helper to retrieve (or create) a Tag by name.
    """
    t = Tag.query.filter_by(name=tag_name).first()
    if not t:
        t = Tag(name=tag_name)
        db.session.add(t)
        db.session.commit()
    return t

def load_json_data(file_path):
    """
    Load data from a JSON file
    """
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error loading JSON data from {file_path}: {e}")
        return None

@app.before_request
def create_tables():
    """
    Creates all tables if they don't exist, then seeds data once.
    """
    db.create_all()
    seed_data()

def seed_data():
    """
    Populates the database with initial data if it doesn't already exist.
    Prevents duplicate insertions by checking if records exist first.
    """
    # Ensure JSON files exist
    experiences_json = Path('data/experiences.json')
    profile_json = Path('data/profile.json')
    
    if not experiences_json.exists():
        with open(experiences_json, 'w') as f:
            json.dump({"experiences": []}, f, indent=4)
            
    if not profile_json.exists():
        with open(profile_json, 'w') as f:
            json.dump({"profile": {
                "name": "Ryo ",
                "title": "Software Engineer",
                "bio": "Aspiring CS student with expertise in AI, data engineering, and software solutions.",
                "img_path": "/static/images/ryosketch-1.png"
            }}, f, indent=4)
    
    # Seed Profile data
    if not Profile.query.first():
        profile_data = load_json_data('data/profile.json')
        if profile_data and 'profile' in profile_data:
            profile = Profile(
                name=profile_data['profile'].get('name', ''),
                title=profile_data['profile'].get('title', ''),
                bio=profile_data['profile'].get('bio', ''),
                img_path=profile_data['profile'].get('img_path', '')
            )
            db.session.add(profile)
            db.session.commit()

    # Skip if experiences already exist
    if Experience.query.first():
        return

    # Load experience data from JSON file
    data = load_json_data('data/experiences.json')
    if not data or 'experiences' not in data:
        print("No experience data found or invalid data format.")
        return
    
    if not data['experiences']:
        print("No experiences in the JSON file.")
        return

    # Insert the experiences from our data
    for item in data["experiences"]:
        etype = get_or_create_experience_type(item["experience_type"])
        
        # Properly handle links, link_images, and images from JSON
        links = item.get("links", [])
        # Flatten any lists that may contain newline-separated values
        flattened_links = []
        for link in links:
            if '\n' in link or '\r' in link:
                # Split by newlines and add each item
                for sublink in link.replace('\r', '').split('\n'):
                    if sublink.strip():
                        flattened_links.append(sublink.strip())
            else:
                flattened_links.append(link.strip())
        
        link_images = item.get("link_images", [])
        flattened_link_images = []
        for img in link_images:
            if '\n' in img or '\r' in img:
                for subimg in img.replace('\r', '').split('\n'):
                    if subimg.strip():
                        flattened_link_images.append(subimg.strip())
            else:
                flattened_link_images.append(img.strip())
        
        images = item.get("images", [])
        flattened_images = []
        for img in images:
            if '\n' in img or '\r' in img:
                for subimg in img.replace('\r', '').split('\n'):
                    if subimg.strip():
                        flattened_images.append(subimg.strip())
            else:
                flattened_images.append(img.strip())
        
        exp = Experience(
            experience_type_id=etype.id,
            title=item.get("title"),
            subtitle=item.get("subtitle"),
            term=item.get("term"),
            short_description=item.get("short_description"),
            long_description=item.get("long_description"),
            # main_image=item.get("main_image", "default_image.png"),  # Use a default image if none is provided
            links=",".join(flattened_links),  # Use flattened list
            link_images=",".join(flattened_link_images),  # Use flattened list
            images=",".join(flattened_images),  # Use flattened list
        )

        db.session.add(exp)
        db.session.flush()

        for tag_name in item.get("tags", []):
            tag_obj = get_or_create_tag(tag_name)
            exp.tags.append(tag_obj)

    db.session.commit()

def get_github_stats(username, access_token):
    """Fetch GitHub repository count and contributions"""
    headers = {
        'Authorization': f'token {access_token}',
        'Accept': 'application/vnd.github.v3+json'
    }
    
    # Get repository count (including private)
    repo_url = 'https://api.github.com/user/repos?per_page=100'
    repos = []
    page = 1
    
    while True:
        response = requests.get(f'{repo_url}&page={page}', headers=headers)
        if response.status_code != 200 or not response.json():
            break
        repos.extend(response.json())
        page += 1
        if page > 10:  # Safety limit
            break
    
    # For contributions, use GraphQL API
    graphql_url = 'https://api.github.com/graphql'
    query = """
    query {
      user(login: "%s") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
        }
      }
    }
    """ % username
    
    graphql_response = requests.post(
        graphql_url, 
        json={'query': query}, 
        headers=headers
    )
    
    contribution_count = 0
    if graphql_response.status_code == 200:
        data = graphql_response.json()
        try:
            contribution_count = data['data']['user']['contributionsCollection']['contributionCalendar']['totalContributions']
        except (KeyError, TypeError):
            pass
    
    return {
        "repo_count": len(repos),
        "contribution_count": contribution_count
    }

@app.route('/')
def home():
    """
    Display the profile (if any) and all experiences.
    """
    profile = Profile.query.first()
    experiences = Experience.query.all()
    
    # Get tags sorted by frequency (number of experiences using each tag)
    # This query counts how many experiences use each tag and orders by that count
    tag_counts = db.session.query(
        Tag, 
        func.count(Experience.tags).label('tag_count')
    ).join(
        Experience.tags
    ).group_by(
        Tag.id
    ).order_by(
        func.count(Experience.tags).desc()
    ).all()
    
    # Extract just the Tag objects from the results, maintaining order
    tags = [tag for tag, count in tag_counts]

    # Get GitHub stats (if configured)
    username = "ryofujimura"
    access_token = ""
    
    github_stats = get_github_stats(username, access_token)
    
    return render_template('index.html', profile=profile, experiences=experiences, tags=tags, github_stats=github_stats)

@app.route('/project/<int:project_id>')
def project_detail(project_id):
    """
    Display a specific project with modal pre-opened
    """
    profile = Profile.query.first()
    experiences = Experience.query.all()
    
    # Get tags sorted by frequency (number of experiences using each tag)
    tag_counts = db.session.query(
        Tag, 
        func.count(Experience.tags).label('tag_count')
    ).join(
        Experience.tags
    ).group_by(
        Tag.id
    ).order_by(
        func.count(Experience.tags).desc()
    ).all()
    
    # Extract just the Tag objects from the results, maintaining order
    tags = [tag for tag, count in tag_counts]
    
    # Get the specific project (or 404 if not found)
    project = Experience.query.get_or_404(project_id)
    
    # Pass the direct project ID to the template
    return render_template('index.html', profile=profile, experiences=experiences, 
                          tags=tags, direct_project_id=project_id)

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session['logged_in'] = True
            flash('You are now logged in', 'success')
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Invalid credentials', 'danger')
    
    return render_template('admin/login.html')

@app.route('/admin/logout')
def admin_logout():
    session.clear()
    flash('You have been logged out', 'success')
    return redirect(url_for('admin_login'))

@app.route('/admin')
@login_required
def admin_dashboard():
    experiences = Experience.query.all()
    return render_template('admin/dashboard.html', experiences=experiences)

@app.route('/admin/experience/new', methods=['GET', 'POST'])
@login_required
def admin_new_experience():
    if request.method == 'POST':
        # Get experience type or create new one
        exp_type_name = request.form.get('experience_type')
        exp_type = get_or_create_experience_type(exp_type_name)
        
        # Process links, link_images, and images - convert line breaks to commas
        links = request.form.get('links', '').replace('\r', '').split('\n')
        links = [link.strip() for link in links if link.strip()]
        
        link_images = request.form.get('link_images', '').replace('\r', '').split('\n')
        link_images = [img.strip() for img in link_images if img.strip()]
        
        images = request.form.get('images', '').replace('\r', '').split('\n')
        images = [img.strip() for img in images if img.strip()]
        
        # Create new experience
        exp = Experience(
            experience_type_id=exp_type.id,
            title=request.form.get('title'),
            subtitle=request.form.get('subtitle'),
            term=request.form.get('term'),
            short_description=request.form.get('short_description'),
            long_description=request.form.get('long_description'),
            links=','.join(links),
            link_images=','.join(link_images),
            images=','.join(images)
        )
        
        db.session.add(exp)
        db.session.flush()  # Get ID before committing
        
        # Handle tags
        tags = request.form.get('tags', '').split(',')
        tags = [tag.strip() for tag in tags if tag.strip()]
        
        for tag_name in tags:
            tag_obj = get_or_create_tag(tag_name)
            exp.tags.append(tag_obj)
        
        db.session.commit()
        flash('Experience added successfully', 'success')
        
        # Update JSON file
        save_experiences_to_json()
        
        return redirect(url_for('admin_dashboard'))
    
    # For GET request
    experience_types = ExperienceType.query.all()
    tags = Tag.query.all()
    return render_template('admin/experience_form.html', 
                          experience=None, 
                          experience_types=experience_types,
                          tags=tags)

@app.route('/admin/experience/edit/<int:exp_id>', methods=['GET', 'POST'])
@login_required
def admin_edit_experience(exp_id):
    exp = Experience.query.get_or_404(exp_id)
    
    if request.method == 'POST':
        # Get experience type or create new one
        exp_type_name = request.form.get('experience_type')
        exp_type = get_or_create_experience_type(exp_type_name)
        
        # Process links, link_images, and images - convert line breaks to commas
        links = request.form.get('links', '').replace('\r', '').split('\n')
        links = [link.strip() for link in links if link.strip()]
        
        link_images = request.form.get('link_images', '').replace('\r', '').split('\n')
        link_images = [img.strip() for img in link_images if img.strip()]
        
        images = request.form.get('images', '').replace('\r', '').split('\n')
        images = [img.strip() for img in images if img.strip()]
        
        # Update experience
        exp.experience_type_id = exp_type.id
        exp.title = request.form.get('title')
        exp.subtitle = request.form.get('subtitle')
        exp.term = request.form.get('term')
        exp.short_description = request.form.get('short_description')
        exp.long_description = request.form.get('long_description')
        exp.links = ','.join(links)
        exp.link_images = ','.join(link_images)
        exp.images = ','.join(images)
        
        # Clear existing tags
        exp.tags = []
        
        # Handle tags
        tags = request.form.get('tags', '').split(',')
        tags = [tag.strip() for tag in tags if tag.strip()]
        
        for tag_name in tags:
            tag_obj = get_or_create_tag(tag_name)
            exp.tags.append(tag_obj)
        
        db.session.commit()
        flash('Experience updated successfully', 'success')
        
        # Update JSON file
        save_experiences_to_json()
        
        return redirect(url_for('admin_dashboard'))
    
    # For GET request
    experience_types = ExperienceType.query.all()
    tags = Tag.query.all()
    current_tags = ','.join([tag.name for tag in exp.tags])
    return render_template('admin/experience_form.html', 
                          experience=exp, 
                          experience_types=experience_types,
                          tags=tags,
                          current_tags=current_tags)

@app.route('/admin/experience/delete/<int:exp_id>', methods=['POST'])
@login_required
def admin_delete_experience(exp_id):
    exp = Experience.query.get_or_404(exp_id)
    db.session.delete(exp)
    db.session.commit()
    flash('Experience deleted successfully', 'success')
    
    # Update JSON file
    save_experiences_to_json()
    
    return redirect(url_for('admin_dashboard'))

def save_experiences_to_json():
    """Save all experiences from the database to the JSON file"""
    experiences = Experience.query.all()
    data = {"experiences": []}
    
    for exp in experiences:
        # Handle comma-separated lists properly
        links = exp.links.split(',') if exp.links else []
        links = [link.strip() for link in links if link.strip()]
        
        link_images = exp.link_images.split(',') if exp.link_images else []
        link_images = [img.strip() for img in link_images if img.strip()]
        
        images = exp.images.split(',') if exp.images else []
        images = [img.strip() for img in images if img.strip()]
        
        experience_data = {
            "experience_type": exp.experience_type.name,
            "title": exp.title,
            "subtitle": exp.subtitle,
            "term": exp.term,
            "short_description": exp.short_description,
            "long_description": exp.long_description,
            "links": links,
            "link_images": link_images,
            "images": images,
            "tags": [tag.name for tag in exp.tags]
        }
        data["experiences"].append(experience_data)
    
    try:
        with open('data/experiences.json', 'w') as f:
            json.dump(data, f, indent=4)
        print("Experiences saved to JSON file")
    except Exception as e:
        print(f"Error saving experiences to JSON: {e}")

@app.route('/project/githubrepocounter')
def github_repo_counter():
    """
    Serves the GitHub Repository Counter application
    This dynamically pulls content from the GitHub repo when accessed
    """
    return render_template('github.html')

if __name__ == '__main__':
    # Ensure the DB file can exist
    if not os.path.exists('local_database.db'):
        open('local_database.db', 'a').close()

    # Call create_tables() explicitly when the app starts
    with app.app_context():
        create_tables()

    app.run(debug=True)