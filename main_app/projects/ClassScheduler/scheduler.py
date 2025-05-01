# scheduler.py

import sqlite3
import os
from itertools import product
import re # Import re for more robust parsing if needed later

# Define global constants
START_TIME = 8 * 60    # 8:00 AM in minutes
END_TIME = 22 * 60     # 10:00 PM in minutes

DAYS = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su']
FULL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

DAY_MAPPING = {
    'M': 'Monday',
    'Tu': 'Tuesday',
    'W': 'Wednesday',
    'Th': 'Thursday',
    'F': 'Friday',
    'Sa': 'Saturday',
    'Su': 'Sunday'
}

def get_db_connection():
    """
    Establish a connection to the SQLite database.
    """
    db_path = os.path.join(os.path.dirname(__file__), 'class_schedule.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

# --- Internal Time Parsing Helpers ---

def _parse_time_string(time_str):
    """
    Parses a time string into components without making AM/PM assumptions yet.

    Returns: tuple (hours, minutes, am_pm_specified, is_pm)
        hours (int): Hour (1-12 or 0-23 depending on format)
        minutes (int): Minute (0-59)
        am_pm_specified (bool): True if 'am' or 'pm' was present.
        is_pm (bool): True if 'pm' was specified, False if 'am' or unspecified.
                     Note: This initial 'is_pm' is based ONLY on the presence
                     of 'pm' suffix, not heuristics yet.
    Raises: ValueError on invalid format.
    """
    original_time_str = str(time_str).strip()
    if not original_time_str:
        raise ValueError("Empty time string provided")

    time_str_lower = original_time_str.lower()
    am_pm_specified = False
    is_pm = False # Default assumption

    if time_str_lower.endswith('pm'):
        is_pm = True
        am_pm_specified = True
        time_str_processed = time_str_lower[:-2].strip()
    elif time_str_lower.endswith('am'):
        is_pm = False # Explicitly AM
        am_pm_specified = True
        time_str_processed = time_str_lower[:-2].strip()
    else:
        am_pm_specified = False
        time_str_processed = time_str_lower

    if not time_str_processed:
         raise ValueError("Time string became empty after stripping AM/PM")

    # Handle different formats (e.g., "1:30", "1330", "930", "3", "10")
    if ':' in time_str_processed:
        parts = time_str_processed.split(':')
        if len(parts) != 2:
             raise ValueError(f"Invalid time format with colon: '{time_str_processed}'")
        try:
            hours = int(parts[0])
            minutes = int(parts[1])
        except ValueError:
             raise ValueError(f"Non-numeric hour/minute in '{time_str_processed}'")
    else:
        try:
            if len(time_str_processed) >= 3: # HHMM or HMM like "930"
                 hours = int(time_str_processed[:-2])
                 minutes = int(time_str_processed[-2:])
            elif len(time_str_processed) > 0: # H or HH like "3" or "10"
                 hours = int(time_str_processed)
                 minutes = 0
            else: # Should not happen due to earlier check
                 raise ValueError("Processed time string is empty")
        except ValueError:
             raise ValueError(f"Non-numeric time value in '{time_str_processed}'")

    # --- Basic validation on parsed numbers ---
    # We validate 1-12 range only if AM/PM was explicit. Otherwise allow 1-24 for now.
    if am_pm_specified:
        if not (1 <= hours <= 12):
            raise ValueError(f"Hour '{hours}' invalid with AM/PM specifier in '{original_time_str}'")
    elif not (1 <= hours <= 24): # Allow 1-24 if no AM/PM specified yet
         raise ValueError(f"Hour '{hours}' out of range (1-24) in '{original_time_str}'")

    if not (0 <= minutes <= 59):
        raise ValueError(f"Minute '{minutes}' out of range (0-59) in '{original_time_str}'")

    if hours == 24 and minutes != 0:
        raise ValueError(f"Hour 24 is only valid as 24:00 in '{original_time_str}'")

    return hours, minutes, am_pm_specified, is_pm


def _determine_final_hour(hours, am_pm_specified, is_pm_specified, context_is_pm=None, is_start_time=False):
    """
    Applies heuristics and context to determine the final 24-hour format hour.

    Args:
        hours (int): The initially parsed hour (1-24).
        am_pm_specified (bool): Whether AM/PM was in the original string.
        is_pm_specified (bool): If AM/PM was specified, was it PM?
        context_is_pm (bool | None): For start times, indicates if the corresponding end time is PM.
        is_start_time (bool): Flag indicating if this is for a start time (to apply context rules).

    Returns: int: Hour in 24-hour format (0-23, or 24 for 24:00 case).
    Raises: ValueError for contradictions.
    """
    final_hours = hours # Start with the parsed hour

    if am_pm_specified:
        # AM/PM was explicit, standard conversion rules apply
        if final_hours == 12:
            final_hours = 0 if not is_pm_specified else 12 # 12 AM is 0, 12 PM is 12
        elif is_pm_specified:
            final_hours += 12 # 1 PM to 11 PM
        # 1 AM to 11 AM: final_hours remains unchanged
    else:
        # No AM/PM specified, apply heuristics and context
        if final_hours == 24:
             pass # Keep 24 for 24:00 end time marker
        elif is_start_time and context_is_pm is not None:
            # --- Apply context rules based on end time ---
            if context_is_pm: # End time is PM
                if final_hours == 11:
                    # print(f"Context: End is PM, Start is 11 -> Assuming 11 AM") # Debug
                    pass # Assume 11 AM
                elif 1 <= final_hours <= 10:
                    # print(f"Context: End is PM, Start is {final_hours} -> Assuming PM") # Debug
                    final_hours += 12 # Assume 1-10 are PM
                elif final_hours == 12:
                    # print(f"Context: End is PM, Start is 12 -> Assuming 12 PM") # Debug
                    pass # Assume 12 PM (noon)
                # else hours >= 13 are already 24-hour format
            else: # End time is AM
                # If end time is AM, assume ambiguous start times (1-12) are also AM.
                # Hours 8-11 already default to AM. Hours 1-7 might need adjustment if we change default.
                # For now, assume 1-12 are AM if end is AM.
                if final_hours == 12:
                     # print(f"Context: End is AM, Start is 12 -> Assuming 12 AM (0)") # Debug
                     final_hours = 0 # Assume 12 AM (midnight)
                # else 1-11 default to AM anyway or don't need change.
        else:
            # --- Apply default heuristics (no AM/PM, no context or is end time) ---
            if final_hours == 12:
                final_hours = 12 # Assume 12 noon if no AM/PM
            elif 1 <= final_hours <= 7:
                final_hours += 12 # Assume 1-7 PM
            # Hours 8-11 default to AM (no change)
            # Hours 13-23 default to PM (no change, already 24-hr format)

    # Final validation after all adjustments
    if not (0 <= final_hours <= 24): # Allow 24 only for 24:00
         raise ValueError(f"Internal Error: Final hour calculation resulted in {final_hours}")

    return final_hours


# --- Public Time Conversion Function (for standalone use like personal schedules) ---

def time_str_to_minutes(time_str):
    """
    Convert time string in various formats to minutes since midnight.
    Uses default heuristics for ambiguous times (1-7 PM, 8-11 AM, 12 PM).
    Does NOT use context from another time string.
    """
    try:
        hours, minutes, am_pm_specified, is_pm_specified = _parse_time_string(time_str)
        final_hours = _determine_final_hour(hours, am_pm_specified, is_pm_specified, context_is_pm=None, is_start_time=False)

        # Handle 24:00 case - represent as end of day for range calculations if needed elsewhere
        # For minute calculation, treat it like 0 for duration? Or specific value?
        # Let's return minutes, allowing 24 * 60 for end-of-day boundary checks.
        if final_hours == 24 and minutes == 0:
            return 24 * 60

        if not (0 <= final_hours <= 23 and 0 <= minutes <= 59):
             raise ValueError(f"Final time calculation resulted in invalid H/M: {final_hours}:{minutes:02d}")

        return final_hours * 60 + minutes

    except ValueError as ve:
        print(f"ValueError converting time_str '{time_str}': {ve}")
        raise
    except Exception as e:
        print(f"Unexpected error converting time_str '{time_str}': {e}")
        raise


# --- Functions using the time conversion ---

def fetch_classes(class_ids):
    """
    Fetch classes and their time slots from the database.
    Returns a dictionary with class IDs as keys and a list of sections as values.
    Each section includes its time slots represented as bitsets.
    """
    conn = get_db_connection()
    classes = {}

    for class_id in class_ids:
        # Fetch class name
        class_info = conn.execute(
            'SELECT class_id FROM class_offered WHERE id = ?',
            (class_id,)
        ).fetchone()
        if not class_info:
            print(f"No class found with id {class_id}")
            continue
        class_name = class_info['class_id']

        # Fetch class times
        times = conn.execute(
            'SELECT start_time, end_time, days, class_number FROM class_times WHERE class_offered_id = ?',
            (class_id,)
        ).fetchall()

        sections = []
        for time in times:
            # Check for missing or invalid data
            if not time['start_time'] or not time['end_time'] or not time['days']:
                print(f"Invalid time data for class {class_name}: Start='{time['start_time']}', End='{time['end_time']}', Days='{time['days']}'")
                continue
            try:
                # Use create_bitset which now handles context-aware parsing
                bitset = create_bitset(time['start_time'], time['end_time'], time['days'], time_increment=30)
                section = {
                    'class_id': class_id,
                    'class_name': class_name,
                    'start_time': time['start_time'], # Store original strings
                    'end_time': time['end_time'],     # Store original strings
                    'days': time['days'],
                    'class_number': time['class_number'], # Add class_number field
                    'bitset': bitset
                }
                sections.append(section)
            except Exception as e:
                # Error during bitset creation (includes time parsing)
                print(f"Error creating bitset for class {class_name} (Start='{time['start_time']}', End='{time['end_time']}'): {e}")
                continue # Skip this section if time parsing fails

        if sections:
            classes[class_id] = sections
        else:
            print(f"No valid sections found for class {class_name} (ID: {class_id})")

    conn.close()
    return classes

def create_bitset(start_time_str, end_time_str, days_str, time_increment=30):
    """
    Create a bitset representing the class time slots based on the given time increment.
    Uses context-aware time parsing: end time influences interpretation of ambiguous start time.
    """
    bitset = 0
    try:
        # 1. Parse end time components
        end_h, end_m, end_am_pm_spec, end_is_pm_spec = _parse_time_string(end_time_str)
        # 2. Determine final end hour and if it's PM
        final_end_h = _determine_final_hour(end_h, end_am_pm_spec, end_is_pm_spec, context_is_pm=None, is_start_time=False)
        end_time_is_pm = (12 <= final_end_h < 24) # Determine if the resolved end time is PM (noon to 11:59 PM)
        end_minutes = (final_end_h * 60 + end_m) if final_end_h != 24 else 24*60 # Use 24*60 for end boundary

        # 3. Parse start time components
        start_h, start_m, start_am_pm_spec, start_is_pm_spec = _parse_time_string(start_time_str)
        # 4. Determine final start hour using end time context
        final_start_h = _determine_final_hour(start_h, start_am_pm_spec, start_is_pm_spec, context_is_pm=end_time_is_pm, is_start_time=True)
        start_minutes = final_start_h * 60 + start_m

        # Basic sanity check: start time should not be after end time on the same day
        if start_minutes >= end_minutes:
             # Allow start == end only if both are 24:00? No, raise error.
             raise ValueError(f"Parsed start time '{start_time_str}' ({start_minutes} min) is not before end time '{end_time_str}' ({end_minutes} min)")

    except ValueError as ve:
         # Re-raise with more context
         raise ValueError(f"Error parsing time pair (Start='{start_time_str}', End='{end_time_str}'): {ve}") from ve

    # print(f"Parsed Times: Start={start_minutes} min, End={end_minutes} min for '{start_time_str}' - '{end_time_str}'") # Debug

    days = parse_days(days_str)
    total_slots_per_day = TOTAL_TIME_SLOTS(time_increment)

    for day in days:
        if day not in DAYS:
            # print(f"Invalid day '{day}' encountered in '{days_str}'. Skipping.") # Optional logging
            continue
        day_index = DAYS.index(day)
        # Iterate through time slots for the current day
        # Note: range excludes the end time. If a class ends at 2:00 PM (840 min),
        # the last slot should be the one starting before 840.
        for minute_of_day in range(start_minutes, end_minutes, time_increment):
            # Calculate the index relative to the schedule's display range (START_TIME to END_TIME)
            time_slot_index = (minute_of_day - START_TIME) // time_increment

            # Check if the calculated slot falls within the displayable schedule range
            if 0 <= time_slot_index < total_slots_per_day:
                bit_position = day_index * total_slots_per_day + time_slot_index
                # print(f"Setting bit {bit_position} for {day} at slot {time_slot_index} ({minute_of_day} min)") # Debug
                bitset |= 1 << bit_position
            # else: print(f"Skipping time slot at {minute_of_day} min (index {time_slot_index}) - outside schedule range {START_TIME}-{END_TIME}") # Debug

    if bitset == 0:
         # This can happen if the class times fall entirely outside START_TIME/END_TIME range
         print(f"Warning: Class section (Start='{start_time_str}', End='{end_time_str}', Days='{days_str}') resulted in an empty bitset. Times might be outside the {START_TIME//60}:00 - {END_TIME//60}:00 schedule range.")

    return bitset


def create_bitset_minutes(start_time_mins, end_time_mins, days_str, time_increment=30):
    """
    Create a bitset using times already converted to minutes since midnight.
    Used for personal schedule blocks where context parsing isn't needed.
    """
    bitset = 0
    days = parse_days(days_str)
    total_slots_per_day = TOTAL_TIME_SLOTS(time_increment)

    for day in days:
        if day not in DAYS:
            # print(f"Invalid day '{day}' encountered in personal schedule. Skipping.")
            continue
        day_index = DAYS.index(day)
        for minute in range(start_time_mins, end_time_mins, time_increment):
            time_slot = ((minute - START_TIME) // time_increment)
            if 0 <= time_slot < total_slots_per_day:
                bit_position = day_index * total_slots_per_day + time_slot
                bitset |= 1 << bit_position
    return bitset

def parse_days(days_str):
    """
    Parse the days string into a list of days.
    Supports both one-letter and two-letter day abbreviations. Handles potential spaces.
    """
    days_str_cleaned = "".join(str(days_str).split()) # Remove spaces
    two_letter_days = ['Tu', 'Th', 'Sa', 'Su']
    days = []
    i = 0
    while i < len(days_str_cleaned):
        matched = False
        # Prioritize two-letter matches
        for day in two_letter_days:
            if days_str_cleaned.startswith(day, i):
                days.append(day)
                i += len(day)
                matched = True
                break
        if not matched:
            # Check for single-letter days ('M', 'W', 'F')
            one_letter_day = days_str_cleaned[i]
            if one_letter_day in ['M', 'W', 'F']:
                 days.append(one_letter_day)
                 i += 1
            else:
                 # Handle potential unknown character or just skip
                 print(f"Warning: Skipping unrecognized character '{days_str_cleaned[i]}' in days string '{days_str}'")
                 i += 1
    return days


def create_time_slot_class_for_personal(personal_schedule, time_increment=30):
    """
    Create a mapping of time slots to personal schedule blocks based on the given time increment.
    Uses the standalone time_str_to_minutes for parsing.
    """
    time_slot_class = {}
    for block in personal_schedule:
        try:
            start_time = time_str_to_minutes(block['start_time'])
            end_time = time_str_to_minutes(block['end_time'])
            if start_time >= end_time:
                 print(f"Warning: Personal block '{block.get('title', 'Untitled')}' has start time not before end time. Skipping.")
                 continue

            title = block.get('title', 'Personal Time')
            days = parse_days(block['days'])
            bitset = create_bitset_minutes(start_time, end_time, block['days'], time_increment) # Use pre-calculated minutes

            # Map bit positions generated by create_bitset_minutes back to the class info
            total_slots_per_day = TOTAL_TIME_SLOTS(time_increment)
            temp_bitset = bitset
            bit_pos = 0
            while temp_bitset > 0:
                 if (temp_bitset & 1):
                      day_index = bit_pos // total_slots_per_day
                      time_slot = bit_pos % total_slots_per_day
                      # Check if bit position corresponds to a valid day/slot within range
                      if day_index < len(DAYS) and 0 <= time_slot < total_slots_per_day:
                           # Map the bit position to the block details
                           time_slot_class[bit_pos] = {
                               'class_name': title,
                               'start_time': block['start_time'], # Store original string
                               'end_time': block['end_time']     # Store original string
                           }
                 temp_bitset >>= 1
                 bit_pos += 1

        except ValueError as ve:
             print(f"Skipping personal block due to error: {ve}")
        except Exception as e:
             print(f"Unexpected error processing personal block '{block.get('title', 'Untitled')}': {e}")

    return time_slot_class


def create_personal_bitset(personal_schedule, time_increment=30):
    """
    Create a combined bitset representing all user's personal schedule blocks.
    Uses the standalone time_str_to_minutes for parsing.
    """
    total_bitset = 0
    for block in personal_schedule:
        try:
            start_time = time_str_to_minutes(block['start_time'])
            end_time = time_str_to_minutes(block['end_time'])
            if start_time >= end_time:
                 # Warning already printed in create_time_slot_class_for_personal if called
                 continue
            # Directly calculate the bitset portion for this block
            total_bitset |= create_bitset_minutes(start_time, end_time, block['days'], time_increment)
        except ValueError as ve:
            # Error already printed if using the other function too
            # print(f"Skipping personal block in combined bitset due to error: {ve}")
            pass
        except Exception as e:
             print(f"Unexpected error adding personal block '{block.get('title', 'Untitled')}' to bitset: {e}")
    return total_bitset

def TOTAL_TIME_SLOTS(time_increment):
    """
    Calculate total time slots in a day based on the time increment and START/END constants.
    """
    total_minutes = END_TIME - START_TIME
    if total_minutes < 0 or time_increment <= 0:
         # Avoid division by zero or negative total time
         print("Warning: Invalid START_TIME, END_TIME, or time_increment configuration.")
         return 0
    return total_minutes // time_increment # Use // for integer division

# (generate_schedules and bitset_to_matrix_with_classes remain largely the same,
#  ensure they handle potential errors from downstream functions if needed)
# ... [rest of generate_schedules and bitset_to_matrix_with_classes] ...

def generate_schedules(classes, personal_bitset, personal_schedule, time_increment=30):
    """
    Generate all possible schedules without time conflicts based on the given time increment.
    """
    # Get all sections for each class (fetch_classes already filtered bad time data)
    class_sections = list(classes.values())

    # Check if any class list is empty (meaning all sections failed parsing/filtering)
    if not all(class_sections):
        empty_class_ids = [cid for cid, sections in classes.items() if not sections]
        print(f"Warning: Cannot generate schedules because some selected classes had no valid sections after time parsing/filtering: {empty_class_ids}")
        return [] # Return empty list if any selected class has no valid sections

    # Generate all combinations of VALID class sections
    try:
        all_combinations = list(product(*class_sections))
    except Exception as e:
        print(f"Error creating combinations (maybe empty class section list?): {e}")
        return []
    # print(f"Total combinations: {len(all_combinations)}")  # Debug statement

    valid_schedules = []

    # Create time_slot_class mapping for personal schedule blocks
    personal_time_slot_class = create_time_slot_class_for_personal(personal_schedule, time_increment)

    for idx, combination in enumerate(all_combinations):
        # combination is a tuple of section dicts, one for each selected class
        # class_names = [s['class_name'] for s in combination] # Debugging

        total_bitset = personal_bitset
        time_slot_class = {}  # Map time slots to class details for this specific schedule
        conflict = False
        for section in combination:
            # section['bitset'] was calculated in fetch_classes using create_bitset
            section_bitset = section['bitset']

            # Check for conflict with personal schedule or other classes in this combo
            if total_bitset & section_bitset:
                conflict = True
                # print(f"Conflict detected involving class {section['class_name']} (Start='{section['start_time']}', End='{section['end_time']}')")
                break # Conflict found, this combination is invalid
            else:
                # No conflict yet, add this section's bitset to the total
                total_bitset |= section_bitset

                # --- Populate time_slot_class for visualization ---
                # We need to map the bits back to the class info
                temp_bitset = section_bitset
                bit_pos = 0
                total_slots_per_day = TOTAL_TIME_SLOTS(time_increment)
                while temp_bitset > 0:
                     if (temp_bitset & 1):
                          day_index = bit_pos // total_slots_per_day
                          time_slot = bit_pos % total_slots_per_day
                          # Check if bit position corresponds to a valid day/slot within range
                          if day_index < len(DAYS) and 0 <= time_slot < total_slots_per_day:
                               class_info = {
                                   'class_name': section['class_name'],
                                   'start_time': section['start_time'], # Keep original string
                                   'end_time': section['end_time'],     # Keep original string
                                   'class_number': section.get('class_number', '')  # Include class_number if available
                               }
                               time_slot_class[bit_pos] = class_info
                     temp_bitset >>= 1
                     bit_pos += 1
                # --- End Populate ---

        if not conflict:
            # Merge class schedule with personal schedule for visualization
            # Class schedule takes precedence if there's an overlap (shouldn't happen if no conflict)
            combined_time_slot_class = {**personal_time_slot_class, **time_slot_class}

            # Convert the combined mapping into a matrix for display
            schedule_matrix = bitset_to_matrix_with_classes(combined_time_slot_class, time_increment)
            valid_schedules.append({
                'sections': list(combination), # Convert tuple to list for JSON
                'matrix': schedule_matrix
            })
            # print(f"Valid schedule {len(valid_schedules)} added.")

    # print(f"Total valid schedules found: {len(valid_schedules)}")  # Debug statement
    return valid_schedules

def bitset_to_matrix_with_classes(time_slot_class, time_increment=30):
    """
    Convert the time_slot_class mapping (bit_position -> class/block info)
    into a 2D list (matrix) for visualization.
    Rows are time slots, Columns are days.
    """
    num_slots = TOTAL_TIME_SLOTS(time_increment)
    if num_slots <= 0: return [[]] # Handle invalid config

    matrix = [['' for _ in FULL_DAYS] for _ in range(num_slots)]

    for bit_position, item_info in time_slot_class.items():
        day_index = bit_position // num_slots
        time_slot = bit_position % num_slots

        # Ensure indices are within bounds before assignment
        if 0 <= day_index < len(FULL_DAYS) and 0 <= time_slot < num_slots:
            # Store the dict {'class_name': ..., 'start_time': ..., 'end_time': ...}
            matrix[time_slot][day_index] = item_info
        else:
            # This indicates an issue with bit position calculation or TOTAL_TIME_SLOTS
            print(f"Warning: Invalid day_index ({day_index}) or time_slot ({time_slot}) for bit_position {bit_position}. Skipping matrix assignment.")
            pass
    return matrix

# Ensure __main__ block or separate script calls init_db if needed
# if __name__ == "__main__":
#     # Example usage if needed for testing
#     pass
