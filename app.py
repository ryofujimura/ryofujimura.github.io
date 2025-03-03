import os
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
                # New arrays:
                "links": [
                    "https://www.honda.com/",
                    "/static/images/HondaDigitalServiceDevelopment-2024SummerInternProjectReport.pdf"
                ],
                "link_images": [
                    "honda.svg",
                    "cuda.png"
                ],
                "images": [
                    "hondalogo.svg"
                ],
                "tags": ["honda", "nvidia", "cuda", "linux", "ai", "automotive", "nlp", "profit", "research", "team_collaboration"]
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
                    "https://cuscousainc.com/",
                    "https://www.google.com"
                ],
                "link_images": [
                    "cusco_icon.svg",
                    "image_placeholder.svg"
                ],
                "images": [
                    "cusco.svg"
                ],
                "tags": ["python", "project_management", "adobe", "data_management", "profit", "photoshop", "illustrator", "indesign", "google_drive", "automotive"]
            },
            {
                "experience_type": "Work",
                "title": "Data Engineer",
                "subtitle": "FUJITSUBO GIKEN KOGYO CO., LTD",
                "term": "September 2023 - November 2023",
                "short_description": "Python-based scraper to automate data extraction.",
                "long_description": (
                    "Engineered a Python-based software program employing web scraping techniques to extract crucial data from diverse websites. Automated generation workflows with Adobe InDesign, significantly boosting efficiency and achieving a 100% error-free rate by eliminating manual effort across various cases."
                ),
                "links": [
                    "https://www.fujitsubo.co.jp/",
                    "https://www.google.com"
                ],
                "link_images": [
                    "fujitsubo_icon.svg",
                    "image_placeholder.svg"
                ],
                "images": [
                    "fujitsubo.svg"
                ],
                "tags": ["python", "adobe", "profit", "photoshop", "indesign", "automotive", "data_scraper"]
            },
            {
                "experience_type": "Work",
                "title": "Co-PM and Developer",
                "subtitle": "Matcha Time",
                "term": "March 2024 - April 2024",
                "short_description": "Swift/SwiftUI project with multi-city sync.",
                "long_description": (
                    "Developed and created application functions with Swift/SwiftUI, implemented multi-city synchronization, designed and tested features, fixed bugs, and deployed solutions. Planned and completed the project in 4 weeks, launched the application on the Mac App Store."
                ),
                "links": [
                    "https://apps.apple.com/us/app/matcha-time/id6497067918?mt=12",
                    "https://www.google.com"
                ],
                "link_images": [
                    "matchatime_icon.svg",
                    "image_placeholder.svg"
                ],
                "images": [
                    "matchatime.svg"
                ],
                "tags": ["swift", "project_management", "team_collaboration", "macos", "deployed", "appstore"]
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
                    "https://www.google.com"
                ],
                "link_images": [
                    "poker_icon.svg",
                    "image_placeholder.svg"
                ],
                "images": [
                    "poker.png"
                ],
                "tags": ["swift", "project_management", "watchos", "appstore", "algorithm"]
            },
            {
                "experience_type": "Project",
                "title": "Developer",
                "subtitle": "Schedule Mastermind",
                "term": "December 2023 - February 2024",
                "short_description": "Streamlined scheduling with Python & Flask.",
                "long_description": (
                    "Engineered a Python-based application with the Flask framework, streamlining scheduling operations for over 500 classes. Created a user-friendly interface for course selection, timetable generation, and conflict resolution, achieving a 100% reduction in scheduling errors and boosting overall productivity by 25% through automation."
                ),
                "links": [
                    "/app1",
                    "https://www.google.com"
                ],
                "link_images": [
                    "schedule_icon.svg",
                    "image_placeholder.svg"
                ],
                "images": [
                    "schedule.jpg"
                ],
                "tags": ["python", "computer_science", "flask", "project_management", "cartesian_product", "algorithm", "web_app"]
            },
            {
                "experience_type": "Project",
                "title": "Developer and Project Leader",
                "subtitle": "Shohei Home Ground",
                "term": "March 2023 - November 2023",
                "short_description": "Automated Instagram posting, grew 11k followers.",
                "long_description": (
                    "Engineered and deployed a streamlined content scheduling and posting process using Python and the Instagram API, achieving 685 posts and increasing followers by 11,000 in 8 months. Transformed the project from a non-revenue-generating initiative to a profitable venture."
                ),
                "links": [
                    "https://www.instagram.com/shoheihomeground/",
                    "https://www.google.com"
                ],
                "link_images": [
                    "shohei_icon.svg",
                    "image_placeholder.svg"
                ],
                "images": [
                    "shoheihomeground.svg"
                ],
                "tags": ["python", "project_management", "profit", "instagram", "api", "automation", "photography"]
            },
            {
                "experience_type": "Publication",
                "title": "6G Network and Data Management with Blockchain",
                "subtitle": "Research Paper",
                "term": "September 2024",
                "short_description": "Research on AWS & Blockchain for 6G networks.",
                "long_description": (
                    "Explored emerging paradigms in 6G networking and how blockchain can enhance data management and security. Evaluated AWS-based solutions for distributed infrastructures."
                ),
                "links": [
                    "https://docs.google.com/document/d/1K49_6etVnN7hcCNUc1l-0wJpp3B-NT9J/edit?usp=sharing",
                    "https://www.google.com"
                ],
                "link_images": [
                    "paper_icon.svg",
                    "wireless.svg"
                ],
                "images": [
                    
                    "resume.png"
                ],
                "tags": ["computer_science", "research", "blockchain", "networking"]
            },
            {
                "experience_type": "Publication",
                "title": "Demo Abstract: Custom 3D-Printed Mouse: A Proof of Concept for Personalized Input Devices",
                "subtitle": "Research Paper",
                "term": "Febuary 2025",
                "short_description": "This project explores the design and creation of a personalized, ergonomic mouse by reconfiguring a standard mouse's internal components and housing them in a custom 3D-printed shell tailored to the user's hand.",
                "long_description": (
                    "This project focuses on developing a customized input device by reengineering a standard mouse to better suit individual ergonomic needs. Using a BambuLab A1 Mini 3D printer and PLA filament, a lightweight and personalized mouse shell was designed and fabricated to precisely fit the user's hand. The work demonstrates the feasibility of adapting off-the-shelf hardware into bespoke solutions, offering potential applications in personalized ergonomics and robotic system integration. By combining 3D printing with hardware reconfiguration, this project highlights the possibilities for creating tailored, user-centric devices."
                ),
                "links": [
                    "https://drive.google.com/file/d/1vRWFlfFa8N1zJt2LPrJAcNOIH81A1COB/view?usp=sharing"
                ],
                "link_images": [
                    "paper_icon.svg",
                    "3dprint.svg"
                ],
                "images": [
                    "resume.png"
                ],
                "tags": ["computer_science", "research", "3d_printing", "hardware", "ergonomics", "robotics"]
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
            main_image=item.get("main_image", "default_image.png"),  # Use a default image if none is provided
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

@app.route('/')
def home():
    """
    Display the profile (if any) and all experiences.
    """
    profile = Profile.query.first()
    experiences = Experience.query.all()
    tags = Tag.query.all()
    
    return render_template('index.html', profile=profile, experiences=experiences, tags=tags)

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