# WEEK 01: Project Initiation & Baseline Modeling

## Objectives
- Conduct domain research on pulmonary radiology and the visual indicators of pneumonia.
- Curate and structure the initial pediatric Chest X-Ray dataset.
- Train the very first baseline Convolutional Neural Network (CNN) from scratch to establish a performance benchmark.

## Technical Details
During this foundational week, the primary focus was on establishing the machine learning environment and proving that the classification task was mathematically viable.

We utilized a small subset of the Kaggle Chest X-Ray dataset (approximately 50 images per class) to test the `ImageDataGenerator` pipeline. A custom, lightweight CNN was built using Keras `Sequential` API. 

## Challenges & Learnings
- **Overfitting:** The initial custom model suffered from severe overfitting due to the extremely small dataset size. It achieved 99% training accuracy but hovered around 60% validation accuracy, indicating it was memorizing noise. This critical failure paved the way for the dataset scaling experiments conducted in Week 4.
- **Data Ingestion:** Learned the importance of strict directory structuring to allow automated label inference during batch generation.

## Deliverables
- Baseline Jupyter Notebooks for Pneumonia Detection.
- Initial project directory scaffolding.
