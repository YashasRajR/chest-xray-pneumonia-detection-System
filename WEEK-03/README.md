# WEEK 03: Happy/Sad Detection Model

## 🎯 Objectives
- Broaden practical machine learning experience by tackling a distinct, secondary classification problem.
- Build a lightweight CNN to classify human facial expressions (Happy vs. Sad).
- Understand the nuances of facial feature extraction compared to radiological texture extraction.

## 🛠️ Technical Details
This week served as a rapid prototyping exercise. We sourced a small dataset of human faces categorized into Happy and Sad directories. 

The primary learning outcome was understanding how different types of visual data affect network convergence. Facial expressions rely heavily on distinct geometric curves (smiles, frowns, eye shape), whereas pneumonia detection relies heavily on diffuse pixel textures (opacities, cloudiness). 

## 📂 Deliverables
- A dedicated Jupyter Notebook (`Notebook/`) documenting the model architecture, training loops, and loss curves.
- The curated `Dataset/` directory containing the categorized facial images used for training.
