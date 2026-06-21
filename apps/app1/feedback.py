from flask import Flask, request, redirect, render_template
import sqlite3

feedback_app = Flask(__name__)

# Initialize the database
DATABASE = 'feedback.db'

def init_db():
    with sqlite3.connect(DATABASE) as conn:
        c = conn.cursor()
        # Create table for user information
        c.execute('''CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, contact TEXT)''')
        # Create table for comments
        c.execute('''CREATE TABLE IF NOT EXISTS comment (id INTEGER PRIMARY KEY AUTOINCREMENT, name_id INTEGER, comment TEXT, visible BOOLEAN DEFAULT 1, FOREIGN KEY(name_id) REFERENCES user(id))''')
        conn.commit()

@feedback_app.route('/feedback', methods=['GET', 'POST'])
def feedback():
    if request.method == 'POST':
        name = request.form['name']
        contact = request.form['contact']
        comment = request.form['comment']
        
        with sqlite3.connect(DATABASE) as conn:
            c = conn.cursor()
            # Insert user information
            c.execute('INSERT INTO user (name, contact) VALUES (?, ?)', (name, contact))
            name_id = c.lastrowid
            # Insert comment
            c.execute('INSERT INTO comment (name_id, comment) VALUES (?, ?)', (name_id, comment))
            conn.commit()
        return redirect('/feedback')
    
    # Display feedback
    with sqlite3.connect(DATABASE) as conn:
        c = conn.cursor()
        c.execute('''SELECT comment.id, user.name, comment.comment, comment.visible FROM comment 
                     JOIN user ON comment.name_id = user.id WHERE comment.visible = 1''')
        feedback_list = c.fetchall()
    
    return render_template('feedback.html', feedback_list=feedback_list)

@feedback_app.route('/hide_feedback/<int:comment_id>', methods=['POST'])
def hide_feedback(comment_id):
    with sqlite3.connect(DATABASE) as conn:
        c = conn.cursor()
        # Update visibility to hide the comment
        c.execute('UPDATE comment SET visible = 0 WHERE id = ?', (comment_id,))
        conn.commit()
    return redirect('/feedback')

if __name__ == '__main__':
    init_db()
    feedback_app.run(debug=True)