# WEEK 04: Dataset Scaling & Transfer Learning

## Objectives
- Resolve the catastrophic overfitting observed in Week 1.
- Conduct empirical data scaling experiments.
- Implement Transfer Learning architectures (ResNet50, MobileNetV2) to dramatically improve generalization on small datasets.

## The Scaling Experiment
This week was the defining technical milestone of the internship. We aggressively scaled the training dataset from the initial 50 images up to 200, 500, 700, and finally exactly 1000 highly curated, perfectly balanced images.

As the data volume increased, we tracked the reduction in the "overfitting delta" (the gap between training accuracy and validation accuracy). At 1000 images, this gap practically closed, proving that dataset volume cures variance.

## Model Selection
We abandoned the custom CNN in favor of Transfer Learning. MobileNetV2 was ultimately selected over ResNet50 because it achieved comparable accuracy (>92%) while possessing a fraction of the parameter count, making it exceptionally lightweight and fast for web-based inference.

## Deliverables
- Empirical data scaling logs and charts.
- The final, optimized `mobilenet_pneumonia_model.h5` weights file.
