import sqlite3
import csv
import os

def init_db():
    # Create or connect to the database
    conn = sqlite3.connect('class_schedule.db')
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS class_offered (
        id INTEGER PRIMARY KEY,
        class_id TEXT NOT NULL,
        course_title TEXT,
        units TEXT
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS class_times (
        id INTEGER PRIMARY KEY,
        class_offered_id INTEGER,
        section_number TEXT,
        class_number TEXT,
        type TEXT,
        days TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        building TEXT,
        room TEXT,
        instructor TEXT,
        comment TEXT,
        FOREIGN KEY (class_offered_id) REFERENCES class_offered (id)
    )
    ''')
    
    conn.commit()
    
    # Check if we have data to import
    if os.path.exists('cecs_schedule.csv'):
        import_csv_data(conn)
        
    conn.close()
    
    print("Database initialized successfully!")

def import_csv_data(conn):
    cursor = conn.cursor()
    
    # First, clear existing data
    cursor.execute('DELETE FROM class_times')
    cursor.execute('DELETE FROM class_offered')
    
    # Read the CSV file
    with open('cecs_schedule.csv', 'r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        
        # Track unique classes to avoid duplicates
        unique_classes = {}
        
        for row in csv_reader:
            class_id = row['course_code']
            
            # Check if we already added this class
            if class_id not in unique_classes:
                # Insert into class_offered
                cursor.execute('''
                INSERT INTO class_offered (class_id, course_title, units)
                VALUES (?, ?, ?)
                ''', (class_id, row['course_title'], row['units']))
                
                # Store the ID
                unique_classes[class_id] = cursor.lastrowid
            
            class_offered_id = unique_classes[class_id]
            
            # Insert into class_times
            cursor.execute('''
            INSERT INTO class_times (
                class_offered_id, section_number, class_number, type, days,
                start_time, end_time, building, room, instructor, comment
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                class_offered_id,
                row['section_number'],
                row['class_number'],
                row['type'],
                row['days'],
                row['start_time'],
                row['end_time'],
                row['building'],
                row['room'],
                row['instructor'],
                row['comment']
            ))
    
    conn.commit()
    print(f"Imported {len(unique_classes)} classes with their sections from CSV")

if __name__ == "__main__":
    init_db() 