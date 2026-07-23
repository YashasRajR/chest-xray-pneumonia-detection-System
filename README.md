# Pneumonia Detection System & Human Behavior Tracking System

## Project Overview
This repository contains the complete source code and documentation for a comprehensive 8-week Summer Internship project completed at **Akshar AI Ltd**. The project focuses on two distinct applications of Artificial Intelligence:
1. **Medical Diagnostics:** A deep learning-based Pneumonia Detection System utilizing Convolutional Neural Networks (CNNs) to classify chest X-ray images.
2. **Computer Vision:** A real-time Human Behavior Tracking System focusing on Hand & Gesture Recognition using Google MediaPipe and OpenCV.

## Key Features
- **Highly Accurate Classification:** Uses a scaled MobileNetV2 architecture trained on 1000 curated X-ray images, achieving >92% validation accuracy.
- **Real-Time Gesture Tracking:** Sub-millisecond latency hand tracking utilizing custom Euclidean distance heuristics and temporal debouncing buffers to eliminate UI flickering.
- **Full-Stack Web Dashboard:** A responsive, Single Page Application (SPA) built with HTML/CSS/JS (Frontend) and Flask (Backend REST API) for seamless clinical interaction.
- **Robust API Architecture:** Secure multipart/form-data ingestion with strict MIME-type validation and graceful error handling.

## Repository Structure
The internship was structured chronologically. Each week has its own dedicated directory detailing the progress and code developed during that specific timeframe:

- **[WEEK-01](./WEEK-01/):** Initial research, dataset curation, and baseline custom CNN model training.
- **[WEEK-02](./WEEK-02/):** Foundational UI/UX design, Color Theory application, and initial static web page wireframing.
- **[WEEK-03](./WEEK-03/):** Introduction to classification via a Happy/Sad detection model (Skill building).
- **[WEEK-04](./WEEK-04/):** Major data science scaling experiments; transitioning to Transfer Learning (MobileNetV2).
- **[WEEK-05](./WEEK-05/):** Frontend web development, integrating React/Vite architecture.
- **[WEEK-06](./WEEK-06/):** Backend engineering, Flask API construction, and database integration.
- **[WEEK-07](./WEEK-07/):** Quality Assurance, destructive API testing, bug fixing, and computer vision stabilization.
- **[WEEK-08](./WEEK-08/):** Final documentation, technical handover, and UAT analysis.

## Installation & Quick Start

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/YashasRajR/chest-xray-pneumonia-detection-System.git
   cd chest-xray-pneumonia-detection-System
   ```
2. **Initialize a Virtual Environment (Recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Run the Backend Server:**
   ```bash
   cd WEEK-06/Backend  # Navigate to the API directory
   python app.py
   ```
5. **Access the Dashboard:**
   Open a web browser and navigate to `http://localhost:5000` to interact with the diagnostic UI.

## Documentation
For an in-depth understanding of the architecture, empirical scaling experiments, and heuristic algorithms used in this project, please refer to the master 50-page thesis document:
**[Final_Internship_Report_24162121033.md](./Final_Internship_Report_24162121033.md)**

## Author
**Yashas Raj R**  
*B.Tech – Computer Science and Engineering (BDA)*  
ICT Ganpat University | Summer Internship 2026 @ Akshar AI Ltd
