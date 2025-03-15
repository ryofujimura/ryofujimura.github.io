import os, requests
from flask import Flask, render_template
from models import db, Profile, Experience, Tag, ExperienceType

app = Flask(__name__)

# Configure SQLite database (relative path)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///local_database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

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
    if not Profile.query.first():
        profile = Profile(
            name="Ryo ",
            title="Software Engineer",
            bio="Aspiring CS student with expertise in AI, data engineering, and software solutions.",
            img_path="/static/images/ryosketch-1.png"
        )
        db.session.add(profile)
        db.session.commit()

    if Experience.query.first():
        return

    data = {
        "experiences": [
            {
                "experience_type": "Work",
                "title": "Software Engineer Intern",
                "subtitle": "American Honda Motor Company, Inc.",
                "term": "June 2024 - August 2024",
                "short_description": "Researched on-device generative AI for automotive applications. Developed and demonstrated AI features on an NVIDIA Jetson Orin Nano 8GB using Linux, CUDA, and Meta's Llama 3 model.",
                    "long_description": (
                    "Conducted comprehensive research on on-device generative AI, focusing on its potential applications within the automotive industry to enhance vehicle functionalities. Developed and demonstrated applications on an NVIDIA Jetson Orin Nano 8GB using Linux and CUDA, showcasing on-device generative AI capabilities with Meta's Llama 3 model."
                ),
                "links": [
                    "/static/images/HondaDigitalServiceDevelopment-2024SummerInternProjectReport.pdf",
                    "https://www.honda.com/"
                ],
                "link_images": [
                    "resume.png",
                    "honda.svg"
                ],
                "images": [
                    "hondalogo.svg", "honda_1.jpg", "honda_2.jpg", "honda_3.jpg"
                ],
                "tags": ["honda", "hardware_and_systems", "ai_and_algorithms", "automotive", "profit", "research", "team_collaboration"]
            },
            {
                "experience_type": "Work",
                "title": "Co-PM / Developer",
                "subtitle": "Matcha Time",
                "term": "March 2024 - April 2024",
                "short_description": "Swift/SwiftUI project with multi-city sync.",
                "long_description": (
                    "Developed and created application functions with Swift/SwiftUI, implemented multi-city synchronization, designed and tested features, fixed bugs, and deployed solutions. Planned and completed the project in 4 weeks, launched the application on the Mac App Store."
                ),
                "links": [
                    "https://apps.apple.com/us/app/matcha-time/id6497067918?mt=12",
                    "https://www.moyaifujimura.com/work/matcha-time"
                ],
                "link_images": [
                    "appstorelogo.svg",
                    "moyai_1.jpeg"
                ],
                "images": [
                    "matchatime.svg","matchatime_1.jpg", "matchatime_2.jpg", "matchatime_3.jpg"
                ],
                "tags": ["apple_development", "project_leadership", "product_deployment"]
            },
            {
                "experience_type": "Publication",
                "title": "Custom Input Device",
                "subtitle": "Research Paper",
                "term": "Febuary 2025",
                "short_description": "Ergonomic mouse by reconfiguring a standard mouse's internal components and housing them in a custom 3D-printed shell tailored to the user's hand.",
                "long_description": (
                    "This project focuses on developing a customized input device by reengineering a standard mouse to better suit individual ergonomic needs. Using a BambuLab A1 Mini 3D printer and PLA filament, a lightweight and personalized mouse shell was designed and fabricated to precisely fit the user's hand. The work demonstrates the feasibility of adapting off-the-shelf hardware into bespoke solutions, offering potential applications in personalized ergonomics and robotic system integration. By combining 3D printing with hardware reconfiguration, this project highlights the possibilities for creating tailored, user-centric devices."
                ),
                "links": [
                    "https://drive.google.com/file/d/1vRWFlfFa8N1zJt2LPrJAcNOIH81A1COB/view?usp=sharing"
                ],
                "link_images": [
                    "resume.png",
                ],
                "images": [
                    "3dprint.png", "3dprint_1.jpeg", "3dprint_2.jpeg", "3dprint_3.jpeg", "3dprint_4.jpeg", "3dprint_5.jpeg"
                ],
                "tags": ["cs_research", "3d_printing", "hardware", "ergonomics", "robotics"]
            },
            {
                "experience_type": "Work",
                "title": "Data Engineer",
                "subtitle": "CUSCO USA Inc.",
                "term": "October 2021 - Present",
                "short_description": "Led a team to develop Python apps extracting data from thousands of PDFs.",
                "long_description": (
                    "Led a three-member team in developing a Python application that extracted data from 11,560 archived PDF files, utilizing advanced software development methodologies. Demonstrated proficiency in testing and development, including creation of comprehensive test cases to ensure software quality. Enhanced user access to historical data dating back to 1977, resulting in a 30% revenue increase by enabling retrieval of previously inaccessible info."
                ),
                "links": [
                    "https://cuscousainc.com/support/vehicle-specific-catalogs"
                ],
                "link_images": [
                    "cusco_c.svg",
                ],
                "images": [
                    "cusco.svg", "cusco_1.jpg", "cusco_2.jpg", "cusco_3.jpg"
                ],
                "tags": ["python", "project_leadership", "adobe_creative_suite", "data_management", "profit", "google_drive", "automotive"]
            },
            {
                "experience_type": "Project",
                "title": "Developer",
                "subtitle": "Poker Percentage",
                "term": "January 2022 - April 2024",
                "short_description": "WatchOS app for real-time poker odds.",
                "long_description": (
                    "Developed a poker percentage calculator application for watchOS using Swift and WatchKit, facilitating real-time calculation of odds and probabilities. Improved user decision-making by providing accurate insights into poker hands, resulting in a 15% increase in win rates."
                ),
                "links": [
                    "https://apps.apple.com/us/app/poker-pocket-odds/id6499280318",
                ],
                "link_images": [
                    "poker.png",
                ],
                "images": [
                    "poker.png", "poker_1.jpg", "poker_2.jpg", "poker_3.jpg", "poker_4.jpg"
                ],
                "tags": ["apple_development", "project_leadership", "product_deployment", "ai_and_algorithms"]
            },
            {
                # koko
                "experience_type": "Project",
                "title": "Project Leader",
                "subtitle": "Shohei Home Ground",
                "term": "March 2023 - November 2023",
                "short_description": "Automated Instagram posting, grew 11k followers.",
                "long_description": (
                    "Engineered and deployed a streamlined content scheduling and posting process using Python and the Instagram API, achieving 685 posts and increasing followers by 11,000 in 8 months. Transformed the project from a non-revenue-generating initiative to a profitable venture."
                ),
                "links": [
                    "https://www.instagram.com/shoheihomeground/"
                ],
                "link_images": [
                    "shohei_icon.svg"
                ],
                "images": [
                    "shoheihomeground.svg", "shoheihomeground_1.jpg", "shoheihomeground_2.jpg", "shoheihomeground_3.jpg"
                ],
                "tags": ["python", "project_leadership", "profit", "instagram", "api", "automation", "photography"]
            },
            {
                "experience_type": "Publication",
                "title": "6G and Blockchain",
                "subtitle": "Research Paper",
                "term": "September 2024",
                "short_description": "Research on AWS & Blockchain for 6G networks.",
                "long_description": (
                    "Title: 6G Network and Data Management with Blockchain. Explored emerging paradigms in 6G networking and how blockchain can enhance data management and security. Evaluated AWS-based solutions for distributed infrastructures."
                ),
                "links": [
                    "https://drive.google.com/file/d/1LTF__g_qyuyI3-H3hHJsZfPw10Vxv3v5/view?usp=sharing",
                    "https://docs.google.com/document/d/1K49_6etVnN7hcCNUc1l-0wJpp3B-NT9J/edit?usp=sharing"
                ],
                "link_images": [
                    "poster_icon.svg",
                    "resume.png"
                ],
                "images": [
                    "poster_icon.svg", "6GBlockchain_1.jpg", "6GBlockchain_2.jpg", "6GBlockchain_3.jpg"
                ],
                "tags": ["cs_research", "blockchain", "networking"]
            }
        ]
    }


    # Insert the experiences from our data
    for item in data["experiences"]:
        etype = get_or_create_experience_type(item["experience_type"])
        
        exp = Experience(
            experience_type_id=etype.id,
            title=item.get("title"),
            subtitle=item.get("subtitle"),
            term=item.get("term"),
            short_description=item.get("short_description"),
            long_description=item.get("long_description"),
            # main_image=item.get("main_image", "default_image.png"),  # Use a default image if none is provided
            links=",".join(item.get("links", [])),  # Convert list to comma-separated string
            link_images=",".join(item.get("link_images", [])),
            images=",".join(item.get("images", [])),
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
    tags = Tag.query.all()

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
    tags = Tag.query.all()
    
    # Get the specific project (or 404 if not found)
    project = Experience.query.get_or_404(project_id)
    
    # Pass the direct project ID to the template
    return render_template('index.html', profile=profile, experiences=experiences, 
                          tags=tags, direct_project_id=project_id)

if __name__ == '__main__':
    # Ensure the DB file can exist
    if not os.path.exists('local_database.db'):
        open('local_database.db', 'a').close()

    # Call create_tables() explicitly when the app starts
    with app.app_context():
        create_tables()

    app.run(debug=True)