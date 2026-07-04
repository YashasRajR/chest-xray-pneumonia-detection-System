import os
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from prediction import get_model, run_inference

app = Flask(__name__)
# Enable CORS for React frontend integration
CORS(app)

# Configure directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOADS_DIR, exist_ok=True)

MODEL_PATH = os.path.join(BASE_DIR, 'models', 'mobilenetv2_pneumonia_model.keras')

# Pre-load the model when starting the server to avoid loading on every request
try:
    get_model(MODEL_PATH)
except Exception as e:
    print(f"Warning: Could not pre-load model: {e}")

@app.route('/predict', methods=['POST'])
def predict():
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

        # Save temporarily
        file_path = os.path.join(UPLOADS_DIR, file.filename)
        file.save(file_path)

        try:
            # Run Inference
            result_data = run_inference(MODEL_PATH, file_path)
            status_code = 200
        except Exception as preprocess_err:
            print(f"Inference error: {preprocess_err}")
            print(traceback.format_exc())
            result_data = {'error': 'Failed to process or corrupted image'}
            status_code = 400
        finally:
            # Clean up temporary file regardless of success or failure
            if os.path.exists(file_path):
                os.remove(file_path)

        return jsonify(result_data), status_code

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': 'Prediction failed internally on the server'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
