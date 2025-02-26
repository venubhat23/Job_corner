from flask import Flask, request, jsonify, session, redirect, url_for
from flask_mysqldb import MySQL
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import MySQLdb.cursors
from functools import wraps
import pdb


app = Flask(__name__)


CORS(app, supports_credentials=True, origins=["http://localhost:3000"])


app.config.update(
    MYSQL_HOST='127.0.0.1',
    MYSQL_USER='root',
    MYSQL_PASSWORD='NewPassword@123',
    MYSQL_DB='job_corner',
    SECRET_KEY='your_secret_key',
    SESSION_COOKIE_SAMESITE='None',
    SESSION_COOKIE_SECURE=True

)

mysql = MySQL(app)


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user_type = data.get('user_type')
    
    if not email or not password or not user_type:
        return jsonify({'error': 'All fields are required'}), 400

    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("SELECT * FROM accounts WHERE email = %s", (email,))
    existing_user = cur.fetchone()
    
    if existing_user:
        cur.close()
        return jsonify({'error': 'Email already registered'}), 409

    hashed_password = generate_password_hash(password)
    
    try:
        cur.execute("INSERT INTO accounts (email, password, user_type) VALUES (%s, %s, %s)", 
                    (email, hashed_password, user_type))
        mysql.connection.commit()
        user_id = cur.lastrowid

        if user_type == 'employee':
            name = data.get('name')
            skills = data.get('skills')
            education = data.get('education')
            experience = data.get('experience')
            location = data.get('location')
            date_of_birth = data.get('dateOfBirth')

            cur.execute("""
                INSERT INTO employees (user_id, name, skills, education, experience, location, date_of_birth)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (user_id, name, skills, education, experience, location, date_of_birth))
        
        elif user_type == 'company':
            company_name = data.get('companyName')
            industry = data.get('industry')
            name = data.get('name')
            company_description = data.get('companyDescription')

            cur.execute("""
                INSERT INTO companies (user_id, name, company_name, industry, company_description)
                VALUES (%s, %s, %s, %s, %s)
            """, (user_id, name, company_name, industry, company_description))
        
        mysql.connection.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()

@app.route('/login', methods=['POST'])
def login():
   
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("SELECT * FROM accounts WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close();
    if user and check_password_hash(user["password"], password):

        session['user_id'] = user["id"]
        session['loggedin'] = True
        session['user_type']=user["user_type"]
      
        response = jsonify({
            'message': 'Login successful',
            'user': {
                'email': email,
                'user_type': user["user_type"],
                'user_id': user['id']
            }
        })
        return response
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
def logout():
   
    session.clear()

    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/profile', methods=['GET'])
def profile():

    
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized, please log in'}), 401

    user_id = session['user_id']
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    
    try:
        cur.execute("SELECT email, user_type FROM accounts WHERE id = %s", (user_id,))
        user = cur.fetchone()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        if user['user_type'] == 'employee':
            cur.execute("""
                SELECT skills, education, experience, location, date_of_birth
                FROM employees WHERE user_id = %s
            """, (user_id,))
            user['employee_details'] = cur.fetchone()
        
        elif user['user_type'] == 'company':
            cur.execute("""
                SELECT company_name, industry, company_description
                FROM companies WHERE user_id = %s
            """, (user_id,))
            user['company_details'] = cur.fetchone()

        return jsonify({'message': 'Profile fetched successfully', 'user': user})
    
    finally:
        cur.close()

@app.route('/jobs', methods=['GET'])
def all_jobs():
    
    if 'loggedin' in session:
    
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        try:
            cur.execute("""
                SELECT jobs.*, companies.company_name 
                FROM jobs 
                JOIN companies ON jobs.company_id = companies.user_id
            """)
            jobs = cur.fetchall()
            return jsonify(jobs)
        finally:
            cur.close()
    return jsonify({'error': 'User not authorized'}), 404


@app.route('/company/post-job', methods=['POST'])
def post_job():

    if 'loggedin' in session:
        if session.get('user_type') != 'company':
            return jsonify({"error": "Unauthorized"}), 403
        data = request.json
        company_id = 1 
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO jobs (title, company_id, skills, education, working_mode, working_hours, experience, package, location)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (data['title'], company_id, data['skills'], data['education'], data['working_mode'],
            data['working_hours'], data['experience'], data['package'], data['location']))
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Job posted successfully"}), 201
    return jsonify({'error': 'User not authorized'}), 404
@app.route('/apply', methods=['POST'])
def apply_job():
   
    if 'loggedin' in session:
        data = request.json
        user_id = data.get('user_id')  # This comes from accounts table
        job_id = data.get('job_id')

        if not user_id or not job_id:
            return jsonify({"error": "Missing user_id or job_id"}), 400

        cur = mysql.connection.cursor()

 
        cur.execute("SELECT id FROM applied_jobs WHERE user_id = %s AND job_id = %s", (user_id, job_id))
        if cur.fetchone():
            return jsonify({"error": "You have already applied for this job"}), 409

        # Insert application
        cur.execute("INSERT INTO applied_jobs (user_id, job_id) VALUES (%s, %s)", (user_id, job_id))
        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "Application submitted successfully!"})
    return jsonify({"error": "Unauthorized"}), 403
@app.route('/company/delete-job/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    try:
        cur = mysql.connection.cursor()
            
            # Delete job based on the ID
        cur.execute("DELETE FROM jobs WHERE id = %s", (job_id,))
        mysql.connection.commit()
            
        cur.close()
        return jsonify({"message": "Job deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/applied-jobs', methods=['GET'])
def get_applied_jobs():
  
    if 'loggedin' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    user_id = session['user_id']
    
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    try:
        cur.execute("""
            SELECT jobs.id AS job_id, jobs.title, jobs.location, jobs.package, companies.company_name 
            FROM applied_jobs
            JOIN jobs ON applied_jobs.job_id = jobs.id
            JOIN companies ON jobs.company_id = companies.user_id
            WHERE applied_jobs.user_id = %s
        """, (user_id,))
        
        applied_jobs = cur.fetchall()
        return jsonify({'applied_jobs': applied_jobs})
    
    finally:
        cur.close()

@app.route('/job/<int:job_id>', methods=['GET'])
def get_job_details(job_id):
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    try:
        cur.execute("""
            SELECT jobs.*, companies.company_name 
            FROM jobs 
            JOIN companies ON jobs.company_id = companies.user_id
            WHERE jobs.id = %s
        """, (job_id,))
        job = cur.fetchone()

        if not job:
            return jsonify({'error': 'Job not found'}), 404

        return jsonify(job), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()


if __name__ == '__main__':
    app.run(debug=True)  