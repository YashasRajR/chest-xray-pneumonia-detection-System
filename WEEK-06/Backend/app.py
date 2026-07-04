import os
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from utils import preprocess_image

app = Flask(__name__)
# Enable CORS for React frontend integration
CORS(app)

# Configure directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOADS_DIR, exist_ok=True)

MODEL_PATH = os.path.join(BASE_DIR, 'models', 'mobilenetv2_pneumonia_model.keras')

# Load the TensorFlow model globally on startup to improve performance
print("Loading MobileNetV2 model...")
try:
    if os.path.exists(MODEL_PATH):
        model = tf.keras.models.load_model(MODEL_PATH)
        print("Model loaded successfully.")
    else:
        print(f"Warning: Model not found at {MODEL_PATH}")
        model = None
except Exception as e:
    print(f"Failed to load model: {e}")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Server offline: Model not loaded'}), 500

    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided in request'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image selected'}), 400

    # Ensure it's a valid image extension
    allowed_extensions = {'png', 'jpg', 'jpeg'}
    ext = file.filename.rsplit('.', 1)[-1].lower()
    if ext not in allowed_extensions:
        return jsonify({'error': 'Invalid file format. Only JPG, JPEG, and PNG are allowed.'}), 400

    try:
        # Save temporarily
        file_path = os.path.join(UPLOADS_DIR, file.filename)
        file.save(file_path)

        # Preprocess the image
        img_tensor = preprocess_image(file_path)
        if img_tensor is None:
            return jsonify({'error': 'Failed to process image'}), 500

        # Run inference
        prediction_prob = model.predict(img_tensor)[0][0]

        # Convert prediction to label and confidence
        if prediction_prob >= 0.5:
            prediction_label = "Pneumonia"
            confidence = float(prediction_prob * 100)
        else:
            prediction_label = "Normal"
            confidence = float((1 - prediction_prob) * 100)
            
        # Clean up temporary file
        if os.path.exists(file_path):
            os.remove(file_path)

        return jsonify({
            'prediction': prediction_label,
            'confidence': round(confidence, 2)
        }), 200

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': 'Prediction failed internally on the server'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
