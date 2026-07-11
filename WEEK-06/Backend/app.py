import os
import uuid
import datetime
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from prediction import get_model, run_inference
from database import db, PredictionRecord

import jwt
from functools import wraps
from flask_bcrypt import Bcrypt

app = Flask(__name__, static_folder='../Frontend/web-page/dist', static_url_path='/')
# Enable CORS for React frontend integration
CORS(app)
bcrypt = Bcrypt(app)
app.config['SECRET_KEY'] = 'super-secret-key-for-jwt-2026'

# Configure directories and database
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOADS_DIR, exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

MODEL_PATH = os.path.join(BASE_DIR, 'models', 'mobilenetv2_pneumonia_model.keras')

# Pre-load the model when starting the server to avoid loading on every request
try:
    get_model(MODEL_PATH)
except Exception as e:
    print(f"Warning: Could not pre-load model: {e}")

# --- JWT Middleware ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'error': 'Authentication token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            from database import User
            current_user = User.query.filter_by(id=data['user_id']).first()
            if not current_user:
                return jsonify({'error': 'User not found!'}), 401
        except Exception as e:
            return jsonify({'error': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# --- AUTH ENDPOINTS ---
from database import User

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('name') or not data.get('nickname'):
        return jsonify({'error': 'Missing required fields, including nickname.'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
        
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    from sqlalchemy.exc import IntegrityError
    year = datetime.datetime.now().year
    prefix = f"PNE-{year}-"
    
    max_retries = 3
    for attempt in range(max_retries):
        last_user = User.query.filter(User.patient_id.like(f"{prefix}%")).order_by(User.patient_id.desc()).first()
        if last_user and last_user.patient_id:
            try:
                last_seq = int(last_user.patient_id.split('-')[2])
                next_seq = last_seq + 1
            except ValueError:
                next_seq = 1
        else:
            next_seq = 1
            
        new_patient_id = f"{prefix}{next_seq:06d}"
        new_user = User(
            patient_id=new_patient_id, 
            name=data['name'], 
            email=data['email'], 
            password_hash=hashed_password,
            nickname=data.get('nickname'),
            age=data.get('age'),
            mobile=data.get('mobile'),
            role=data.get('role', 'patient')
        )
        
        db.session.add(new_user)
        try:
            db.session.commit()
            break
        except IntegrityError:
            db.session.rollback()
            if attempt == max_retries - 1:
                return jsonify({'error': 'Registration failed due to high concurrency. Please try again.'}), 500
    
    return jsonify({'message': 'User created successfully', 'patient_id': new_patient_id}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing credentials'}), 400
        
    user = User.query.filter_by(email=data['email']).first()
    
    if user and bcrypt.check_password_hash(user.password_hash, data['password']):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'token': token,
            'user': {
                'id': user.id, 
                'name': user.name, 
                'email': user.email, 
                'patient_id': user.patient_id, 
                'role': user.role,
                'age': user.age,
                'mobile': user.mobile
            }
        }), 200
        
    return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/api/user/update', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    if 'name' in data and data['name']:
        current_user.name = data['name']
    if 'age' in data and data['age']:
        try:
            current_user.age = int(data['age'])
        except ValueError:
            return jsonify({'error': 'Age must be an integer'}), 400
    if 'mobile' in data and data['mobile']:
        current_user.mobile = data['mobile']
    if 'password' in data and data['password']:
        current_user.password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    try:
        db.session.commit()
        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'id': current_user.id, 
                'name': current_user.name, 
                'email': current_user.email, 
                'patient_id': current_user.patient_id, 
                'role': current_user.role,
                'age': current_user.age,
                'mobile': current_user.mobile
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/delete', methods=['DELETE'])
@token_required
def delete_account(current_user):
    try:
        # First delete all prediction records associated with the user
        from database import PredictionRecord
        PredictionRecord.query.filter_by(user_id=current_user.id).delete()
        
        # Then delete the user
        db.session.delete(current_user)
        db.session.commit()
        return jsonify({'message': 'Account successfully deleted.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/forgot-password/reset', methods=['POST'])
def forgot_password_reset():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('nickname') or not data.get('newPassword'):
        return jsonify({'error': 'Email, nickname, and new password are required.'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({'error': 'Invalid email or nickname.'}), 400
        
    # Check nickname case-insensitively
    if not user.nickname or user.nickname.lower() != data['nickname'].lower():
        return jsonify({'error': 'Invalid email or nickname.'}), 400
        
    user.password_hash = bcrypt.generate_password_hash(data['newPassword']).decode('utf-8')
    db.session.commit()
    
    return jsonify({'message': 'Password has been reset successfully. You can now sign in.'}), 200

@app.route('/predict', methods=['POST'])
@token_required
def predict(current_user):
    try:
        # Check if model is loaded properly
        try:
            get_model(MODEL_PATH)
        except Exception:
            return jsonify({'error': 'Server offline: Model not loaded'}), 500

        # Validate that a file was uploaded
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided in request'}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image selected'}), 400

        # Validate file extension
        allowed_extensions = {'.png', '.jpg', '.jpeg'}
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in allowed_extensions:
            return jsonify({'error': f'Invalid file format. Only JPG, JPEG, and PNG are allowed. Received: {ext}'}), 400

        unique_id = str(uuid.uuid4())[:9].upper()
        unique_filename = f"{unique_id}{ext}"
        file_path = os.path.join(UPLOADS_DIR, unique_filename)
        file.save(file_path)

        success = False
        try:
            # Run Inference
            result_data = run_inference(MODEL_PATH, file_path)
            
            # Save to Database
            if 'error' not in result_data:
                file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
                new_record = PredictionRecord(
                    id=unique_id,
                    user_id=current_user.id,
                    patient_id=current_user.patient_id,
                    name=file.filename,
                    image_path=unique_filename,
                    size=f"{file_size_mb:.2f} MB",
                    date=datetime.datetime.now(),
                    result=result_data['prediction'].lower(),
                    confidence=float(result_data['confidence']),
                    raw_score=result_data['raw_score'],
                    processing_time=2.4
                )
                db.session.add(new_record)
                db.session.commit()
                
                success = True
                # Attach the generated DB record to the response so the frontend has the full ID and PatientID
                result_data['db_record'] = new_record.to_dict()

            status_code = 200
        except Exception as preprocess_err:
            print(f"Inference error: {preprocess_err}")
            print(traceback.format_exc())
            result_data = {'error': 'Failed to process or corrupted image'}
            status_code = 400
        finally:
            # Only clean up if the prediction failed
            if not success and os.path.exists(file_path):
                os.remove(file_path)

        return jsonify(result_data), status_code

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': 'Prediction failed internally on the server'}), 500

@app.route('/history', methods=['GET'])
@token_required
def get_history(current_user):
    records = PredictionRecord.query.filter_by(user_id=current_user.id).order_by(PredictionRecord.created_at.desc()).all()
    return jsonify([record.to_dict() for record in records])

@app.route('/history/<record_id>', methods=['DELETE'])
@token_required
def delete_record(current_user, record_id):
    record = PredictionRecord.query.filter_by(id=record_id, user_id=current_user.id).first()
    if record:
        db.session.delete(record)
        db.session.commit()
        return jsonify({'success': True}), 200
    return jsonify({'error': 'Record not found or access denied'}), 404

@app.route('/history', methods=['DELETE'])
@token_required
def clear_history(current_user):
    try:
        db.session.query(PredictionRecord).filter_by(user_id=current_user.id).delete()
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# --- TECHNICIAN ROUTES ---
@app.route('/api/technician/analytics', methods=['GET'])
@token_required
def get_technician_analytics(current_user):
    try:
        if current_user.role != 'technician':
            return jsonify({'error': 'Access denied: Technician role required'}), 403
            
        total_scans = PredictionRecord.query.count()
        positive_scans = PredictionRecord.query.filter_by(result='pneumonia').count()
        negative_scans = PredictionRecord.query.filter_by(result='normal').count()
        
        # Calculate rates
        pos_rate = round((positive_scans / total_scans * 100), 1) if total_scans > 0 else 0
        neg_rate = round((negative_scans / total_scans * 100), 1) if total_scans > 0 else 0

        # Get today's scans
        today_str = datetime.datetime.now().strftime("%Y-%m-%d")
        today_scans = PredictionRecord.query.filter(PredictionRecord.date.like(f"{today_str}%")).count()

        return jsonify({
            'totalScans': total_scans,
            'positiveScans': positive_scans,
            'negativeScans': negative_scans,
            'positiveRate': pos_rate,
            'negativeRate': neg_rate,
            'todayScans': today_scans,
            'modelStatus': 'Online',
            'modelVersion': 'MobileNetV2 (NIH Tuned)'
        }), 200
    except Exception as e:
        print(f"Error in analytics: {e}")
        return jsonify({'error': 'Failed to fetch analytics'}), 500

@app.route('/api/technician/patients', methods=['GET'])
@token_required
def get_technician_patients(current_user):
    try:
        if current_user.role != 'technician':
            return jsonify({'error': 'Access denied: Technician role required'}), 403
            
        users = User.query.filter_by(role='patient').all()
        result = []
        for u in users:
            # Count scans for this user
            scan_count = PredictionRecord.query.filter_by(user_id=u.id).count()
            # Get latest scan
            latest_scan = PredictionRecord.query.filter_by(user_id=u.id).order_by(PredictionRecord.created_at.desc()).first()
            
            result.append({
                'patientId': u.patient_id,
                'name': u.name,
                'email': u.email,
                'registeredAt': u.created_at.strftime("%Y-%m-%d") if u.created_at else "Unknown",
                'totalScans': scan_count,
                'lastScanDate': latest_scan.date.isoformat() if latest_scan and isinstance(latest_scan.date, datetime.datetime) else (latest_scan.date if latest_scan else "No scans yet")
            })
            
        return jsonify(result), 200
    except Exception as e:
        print(f"Error fetching patients: {e}")
        return jsonify({'error': 'Failed to fetch patients'}), 500

from flask import send_from_directory
@app.route('/uploads/<path:filename>', methods=['GET'])
def get_upload(filename):
    return send_from_directory(UPLOADS_DIR, filename)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
