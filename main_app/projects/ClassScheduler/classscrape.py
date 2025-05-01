import requests
from bs4 import BeautifulSoup
import csv
import re

def scrape_cecs_schedule(url, output_csv="cecs_schedule.csv"):
    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    # Open CSV for writing
    with open(output_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        # Define the columns you want in your CSV
        writer.writerow([
            "course_code",
            "course_title",
            "units",
            "section_number",
            "class_number",
            "type",
            "days",
            "start_time",
            "end_time",
            "building",
            "room",
            "instructor",
            "comment"
        ])

        # Find all courseBlock containers
        course_blocks = soup.find_all("div", class_="courseBlock")
        row_count = 0

        for block in course_blocks:
            # -------------------------
            # 1) Extract Course Header
            # -------------------------
            course_header = block.find("div", class_="courseHeader")
            if not course_header:
                continue

            # Course code (e.g., CECS 80)
            code_span = course_header.find("span", class_="courseCode")
            course_code = code_span.get_text(strip=True) if code_span else ""

            # Course title (e.g., FOUNDATIONS FOR DATA COMPUTING)
            title_span = course_header.find("span", class_="courseTitle")
            course_title = title_span.get_text(strip=True) if title_span else ""

            # Units (e.g., 1 Unit)
            units_span = course_header.find("span", class_="units")
            units = units_span.get_text(strip=True) if units_span else ""

            # ------------------------------------
            # 2) Find the Table with Class Sections
            # ------------------------------------
            # The <table class="sectionTable"> is typically the *next* sibling of courseHeader
            # or inside the same courseBlock. We’ll just look inside `block`:
            section_table = block.find("table", class_="sectionTable")
            if not section_table:
                # No table for this course? Skip it.
                continue

            # Thead/tbody/tr structure: first row is the header (SEC., CLASS #, etc.)
            # So let’s skip the first row.
            rows = section_table.find_all("tr")
            if len(rows) <= 1:
                continue  # nothing but header

            # 3) For each data row (beyond the header), grab relevant columns
            #    In your screenshot, the columns appear something like:
            #        0:  SEC.
            #        1:  CLASS #
            #        2:  ??? (maybe No Material Cost)
            #        3:  ??? (maybe Reserve)
            #        4:  CLASS NOTES
            #        5:  TYPE
            #        6:  DAYS
            #        7:  TIME
            #        8:  ??? (Open Seats?)
            #        9:  LOCATION
            #        10: INSTRUCTOR
            #        11: COMMENT
            #
            # But in your screenshot’s actual <td> order, it might differ. Verify carefully!

            for row in rows[1:]:
                cells = row.find_all(["th","td"])
                # The "th" is often used for SEC. (scope="row"), so we just gather them all

                # If you see fewer or more columns, adjust these indexes to match:
                if len(cells) < 12:
                    # Possibly an incomplete or spacer row
                    continue

                section_number = cells[0].get_text(strip=True)  # e.g. "01"
                class_number   = cells[1].get_text(strip=True)  # e.g. "11138"
                # skip indexes 2,3,4 if those are columns you don't need
                type_          = cells[5].get_text(strip=True)  # e.g. "ACT"
                days           = cells[6].get_text(strip=True)  # e.g. "TuTh"
                time_text      = cells[7].get_text(strip=True)  # e.g. "12:30 - 1:20PM"
                # skip index 8 if you don't need it
                location       = cells[9].get_text(strip=True)  # e.g. "ECS-413"
                instructor     = cells[10].get_text(strip=True) # e.g. "Malladi S"
                comment        = cells[11].get_text(strip=True) # e.g. "Class instruction ..."

                # 4) Parse Time into start_time and end_time
                start_time, end_time = parse_time_range(time_text)

                # 5) Parse Location into building/room (sometimes "ECS-413" or "ECS 413")
                building, room = parse_location(location)

                # Write a row to the CSV
                writer.writerow([
                    course_code,
                    course_title,
                    units,
                    section_number,
                    class_number,
                    type_,
                    days,
                    start_time,
                    end_time,
                    building,
                    room,
                    instructor,
                    comment
                ])
                row_count += 1

        print(f"Scraping complete. Wrote {row_count} rows to {output_csv}.")

def parse_time_range(time_text):
    """
    Given a string like '12:30 - 1:20PM', split into ('12:30', '1:20PM').
    If no dash is found, return (time_text, '').
    """
    if "-" in time_text:
        parts = time_text.split("-", 1)
        start = parts[0].strip()
        end = parts[1].strip()
        return (start, end)
    else:
        return (time_text, "")

def parse_location(location_text):
    """
    Given something like 'ECS-413' or 'ECS 413', split into (building, room).
    If we can’t parse a room, just store the whole thing in 'building'.
    """
    loc = location_text.strip()
    if not loc:
        return ("", "")
    
    # Try splitting on space OR dash. This is flexible, but you might need to refine logic.
    # e.g. "ECS-413" => building="ECS", room="413"
    # We'll just do a quick check for a dash or space near the end:
    pattern = r"^(.*?)[-\s]?(\d+)$"  # "ECS" + optional dash or space + digits
    match = re.match(pattern, loc)
    if match:
        bldg, rm = match.groups()
        return (bldg.strip(), rm.strip())
    else:
        # If it doesn't match, store entire text as building
        return (loc, "")

if __name__ == "__main__":
    url = "https://web.csulb.edu/depts/enrollment/registration/class_schedule/Fall_2025/By_Subject/CECS.html"
    scrape_cecs_schedule(url, "cecs_schedule.csv")
