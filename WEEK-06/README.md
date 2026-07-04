# AI-Powered Pneumonia Detection System

Welcome to the Week 06 implementation of the AI-Powered Chest X-Ray Pneumonia Detection System. This project transforms a highly accurate MobileNetV2 deep learning model into a full-stack, production-ready AI medical web application.

## Overview

This application allows users to upload digital chest radiography images (X-rays) and receive immediate, AI-driven diagnostic telemetry indicating whether the lungs appear normal or exhibit radiographic features commonly associated with pneumonia.

The project is divided into two primary architectures:
1. Frontend: A modern, responsive React + Vite Single Page Application (SPA).
2. Backend: A robust Python Flask REST API that executes inference using a pre-trained TensorFlow MobileNetV2 Convolutional Neural Network (CNN).

---

## Features

- Drag-and-Drop Interface: Easily drop chest X-ray images directly into the web application.
- Real-Time Inference: Powered by a highly optimized MobileNetV2 architecture loaded into memory upon server initialization for zero-latency inference.
- Rich Diagnostic Dashboard: 
  - Visual scanning animations during processing.
  - Granular confidence metrics and raw AI probability scores.
  - Verbose, medical-grade diagnostic analysis text.
- Dynamic Action History: Automatically tracks past predictions with local storage persistence and a beautifully formatted data table.
- Clinical Report Generation: Generates a printable clinical radiology report summarizing patient ID, model telemetry, and the diagnostic conclusion.

---

## Project Structure

```text
WEEK-06/
├── Backend/
│   ├── app.py                  # Flask server and REST API endpoints
│   ├── prediction.py           # Core TensorFlow model loading and inference logic
│   ├── requirements.txt        # Python dependencies
│   ├── models/                 
│   │   └── mobilenetv2_pneumonia_model.keras  # Pre-trained CNN model
│   └── uploads/                # Temporary processing directory
│
├── Frontend/
│   └── web page(PDS)/          # Vite + React Application
│       ├── package.json
│       ├── src/
│       │   ├── components/     # React components (e.g., PneumoniaDetector)
│       │   ├── services/       # API integration (Axios)
│       │   └── ...
│
└── Notebooks/                  # Jupyter notebooks containing model training pipelines
```

---

## Setup & Installation

### 1. Backend (Flask API)

Navigate to the Backend directory:
```bash
cd Backend
```

Create a virtual environment and activate it (recommended):
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
*(Ensure TensorFlow, Flask, Flask-CORS, Pillow, and NumPy are installed).*

Run the Flask server:
```bash
python app.py
```
*The API will be available at `http://127.0.0.1:5000`.*

### 2. Frontend (React + Vite)

Open a new terminal window and navigate to the Frontend directory:
```bash
cd "Frontend/web page(PDS)"
```

Install Node dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The web interface will be available at `http://localhost:5173` (or the port specified by Vite).*

---

## Model Architecture Details

The core intelligence of this application is driven by MobileNetV2.
- Preprocessing: The model was trained with an embedded Lambda layer for preprocess_input. The Flask backend accurately reconstructs this architecture utilizing Keras custom_objects during model loading.
- Classification Threshold: Configured at 0.70 probability confidence to prioritize high-precision detection of pneumonia infiltrates.

---

## Important Notes

- Medical Disclaimer: This software is built for educational and research purposes. It is not a substitute for professional medical advice, diagnosis, or treatment. All AI findings should be corroborated by a certified radiologist or healthcare professional.
