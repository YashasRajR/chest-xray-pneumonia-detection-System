# AI-Powered Pneumonia Detection System (Akshar AI)

Welcome to the **Akshar AI Chest X-Ray Pneumonia Detection System**. This project transforms a highly accurate MobileNetV2 deep learning model into a full-stack, production-ready AI medical web application with role-based access control, secure patient telemetry, and cloud database integration.

### 🌐 Live Deployment
**The application is live and accessible at:**  
👉 **[https://chest-xray-pneumonia-detection-system.onrender.com](https://chest-xray-pneumonia-detection-system.onrender.com)**

---

## Overview

This application allows users to upload digital chest radiography images (X-rays) and receive immediate, AI-driven diagnostic telemetry indicating whether the lungs appear normal or exhibit radiographic features commonly associated with pneumonia.

The project is divided into two primary architectures:
1. **Frontend:** A modern, responsive React + Vite Single Page Application (SPA).
2. **Backend:** A robust Python Flask REST API connected to a live PostgreSQL database that executes inference using a pre-trained TensorFlow MobileNetV2 Convolutional Neural Network (CNN).

---

## Advanced Features

- **Role-Based Authentication:** Separate portal access for **Patients** (view personal history and secure scans) and **Technicians / Operators** (access global telemetry and clinical analytics).
- **Live Cloud Database Integration:** Uses a robust **PostgreSQL** database hosted on Render, ensuring data persistence and seamless multi-user capability.
- **Drag-and-Drop Interface:** Easily drop chest X-ray images directly into the web application.
- **Real-Time AI Inference:** Powered by a highly optimized MobileNetV2 architecture loaded into memory upon server initialization for zero-latency inference.
- **Rich Diagnostic Dashboard:** 
  - Visual scanning animations during processing.
  - Granular confidence metrics and raw AI probability scores.
  - Verbose, medical-grade diagnostic analysis text.
- **Global Clinical Analytics (Technician Mode):** A dedicated dashboard providing high-level telemetry, scan volume charts, and active patient tracking.
- **Clinical Report Generation:** Generates a printable clinical radiology report summarizing patient ID, model telemetry, and the diagnostic conclusion.

---

## Project Structure

```text
WEEK-06/
├── Backend/
│   ├── app.py                  # Flask server, REST API endpoints, and Auth routes
│   ├── database.py             # SQLAlchemy Models (Patient, Technician, PredictionRecord)
│   ├── prediction.py           # Core TensorFlow model loading and inference logic
│   ├── requirements.txt        # Python dependencies
│   ├── models/                 
│   │   └── mobilenetv2_pneumonia_model.keras  # Pre-trained CNN model
│   ├── uploads/                # Temporary processing directory
│   └── scripts/                # Database management & migration utility scripts
│       ├── sync_db.py          # Script to download Live Postgres data to local SQLite
│       └── view_live_db.py     # Script to securely view Live Postgres tables in terminal
│
├── Frontend/
│   └── web-page/               # Vite + React Application
│       ├── package.json
│       ├── src/
│       │   ├── components/     # React components (LoginForm, TechnicianDashboard, etc.)
│       │   ├── services/       # API integration and JWT management
│       │   └── ...
│
└── Notebooks/                  # Jupyter notebooks containing model training pipelines
```

---

## Setup & Local Installation

*(Note: The application is already deployed live, but you can also run it locally!)*

### 1. Backend (Flask API)

Navigate to the Backend directory:
```bash
cd Backend
```

Create a virtual environment and activate it:
```bash
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
```

Install the required dependencies:
```bash
pip install -r requirements.txt
```

Run the Flask server:
```bash
python app.py
```
*The API will be available at `http://127.0.0.1:5000`.*

### 2. Frontend (React + Vite)

Open a new terminal window and navigate to the Frontend directory:
```bash
cd Frontend/web-page
```

Install Node dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The web interface will be available at `http://localhost:5173`.*

---

## Live Database Management Tools

To help manage the live PostgreSQL production database directly from your local terminal, we have provided built-in scripts inside the `Backend/scripts/` folder:

- **Sync Live Database to Local SQLite:**  
  Run `python scripts/sync_db.py` to seamlessly download the latest production data directly into your local `database.db` file so it can be viewed in VSCode SQLite extensions.
- **View Live Database Tables:**  
  Run `python scripts/view_live_db.py` to securely print all production patient and prediction records directly to your terminal screen.

---

## Model Architecture Details

The core intelligence of this application is driven by MobileNetV2.
- **Preprocessing:** The model was trained with an embedded Lambda layer for `preprocess_input`. The Flask backend accurately reconstructs this architecture utilizing Keras custom_objects during model loading.
- **Classification Threshold:** Configured at **0.70 probability confidence** to prioritize high-precision detection of pneumonia infiltrates.

---

## Important Notes

- **Medical Disclaimer:** This software is built for educational and research purposes. It is not a substitute for professional medical advice, diagnosis, or treatment. All AI findings should be corroborated by a certified radiologist or healthcare professional.
