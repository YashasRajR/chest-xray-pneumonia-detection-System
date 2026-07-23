# WEEK 06: Backend API & Database Architecture

## Objectives
- Liberate the trained `.h5` deep learning model from the local Python/Jupyter environment.
- Construct a robust RESTful API using the Flask framework.
- Establish a local SQLite database connection for persistent record storage.

## Technical Details
This week focused entirely on backend infrastructure. The Flask server acts as the critical bridge between the user-facing React dashboard and the mathematical tensor operations.

**The Inference Pipeline (`app.py`):**
1. Receives the raw byte stream via the `/predict` POST endpoint.
2. Utilizes Pillow (PIL) and NumPy to resize the image to exactly `224x224`.
3. Normalizes the pixel intensity values `(img / 255.0)`.
4. Executes the `.predict()` forward pass on the MobileNetV2 model.
5. Returns a structured JSON payload containing the diagnosis and confidence threshold.

## Database Integration
A lightweight `database.db` (SQLite) was integrated using SQLAlchemy to simulate a hospital's Electronic Health Record (EHR) system, storing the timestamps, patient IDs (simulated), and diagnostic outcomes for historical querying.

## Deliverables
- Flask backend source code (`app.py`, routing logic).
- Initialized `database.db` schema.
