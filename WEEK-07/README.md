# WEEK 07: Quality Assurance & Computer Vision Stabilization

## 🎯 Objectives
- Conduct rigorous Destructive Testing on the Flask API.
- Refine and stabilize the real-time Hand Tracking computer vision module.
- Solve UI flickering caused by webcam sensor noise.

## 🐛 Destructive Testing
The philosophy this week was: *Try to break the system.*
We uploaded PDFs renamed as `.jpg`, injected 20MB files to cause memory exhaustion, and tested malformed JSON bodies. The API was hardened to utilize strict MIME-type validation, gracefully rejecting malicious payloads with `415 Unsupported Media Type` errors instead of crashing the server.

## 🖐️ Computer Vision Debouncing
The Hand Tracking module (MediaPipe/OpenCV) suffered from rapid state flickering when environmental lighting dropped, causing the calculated Euclidean distances to jitter across the classification threshold.

**The Solution:** We implemented a "Debouncing" algorithm—a rolling temporal buffer that stores the last 10 frame classifications. The final output rendered to the screen is the *statistical mode* of that buffer. This completely eradicated flickering and provided a buttery smooth, highly stable gesture output (Open Palm vs. Closed Fist).

## 📂 Deliverables
- `testing_and_bug_logs.txt` detailing the QA methodologies.
- Hardened backend code and stabilized OpenCV Python scripts.
