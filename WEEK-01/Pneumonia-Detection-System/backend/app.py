from flask import Flask, jsonify, send_file
from flask_cors import CORS
from pathlib import Path
from glob import glob
from PIL import Image

import numpy as np
import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt
import cv2
import io
import random

# ==========================================
# FLASK CONFIGURATION
# ==========================================

app = Flask(__name__)
CORS(app)

# ==========================================
# DATASET CONFIGURATION
# ==========================================

DATASET_PATH = Path(
    "Dataset/chest_xray/chest_xray"
)

CLASSES = [
    "NORMAL",
    "PNEUMONIA"
]

SPLITS = [
    "train",
    "test",
    "val"
]

# ==========================================
# HELPER FUNCTIONS
# ==========================================

def get_image_count(split, cls):
    return len(
        glob(
            str(
                DATASET_PATH /
                split /
                cls /
                "*"
            )
        )
    )

def get_random_images(cls, n):
    images = glob(
        str(
            DATASET_PATH /
            "train" /
            cls /
            "*"
        )
    )

    return random.sample(
        images,
        min(n, len(images))
    )

def get_image_size(image_path):
    img = Image.open(image_path)
    return img.size

# ==========================================
# HOME ROUTE
# ==========================================

@app.route("/")
def home():
    return jsonify({
        "message":
        "Pneumonia Detection Flask API Running"
    })

# ==========================================
# CLASS DISTRIBUTION
# ==========================================

@app.route("/api/class-distribution")
def class_distribution():

    return jsonify([

        {
            "Class": "NORMAL",
            "Count":
            get_image_count(
                "train",
                "NORMAL"
            )
        },

        {
            "Class": "PNEUMONIA",
            "Count":
            get_image_count(
                "train",
                "PNEUMONIA"
            )
        }

    ])

# ==========================================
# DATASET SUMMARY
# ==========================================

@app.route("/api/dataset-summary")
def dataset_summary():

    result = []

    for split in SPLITS:

        for cls in CLASSES:

            result.append({

                "Split": split,
                "Class": cls,

                "Count":
                get_image_count(
                    split,
                    cls
                )

            })

    return jsonify(result)

# ==========================================
# SAMPLE METADATA
# ==========================================

@app.route("/api/sample-metadata")
def sample_metadata():

    result = []

    for cls in CLASSES:

        images = get_random_images(
            cls,
            3
        )

        for image_path in images:

            try:

                img = Image.open(
                    image_path
                )

                width, height = img.size

                result.append({

                    "Class": cls,

                    "Filename":
                    Path(
                        image_path
                    ).name,

                    "Width": width,

                    "Height": height,

                    "Format":
                    img.format

                })

            except:
                pass

    return jsonify(result)

# ==========================================
# RESOLUTION ANALYSIS
# ==========================================

@app.route("/api/resolution-analysis")
def resolution_analysis():

    widths = []
    heights = []

    for cls in CLASSES:

        image_files = get_random_images(
            cls,
            50
        )

        for image_path in image_files:

            try:

                width, height = get_image_size(
                    image_path
                )

                widths.append(width)
                heights.append(height)

            except:
                pass

    return jsonify({

        "AverageWidth":
        round(
            np.mean(widths),
            2
        ),

        "AverageHeight":
        round(
            np.mean(heights),
            2
        ),

        "MinWidth":
        int(min(widths)),

        "MaxWidth":
        int(max(widths)),

        "MinHeight":
        int(min(heights)),

        "MaxHeight":
        int(max(heights))

    })

# ==========================================
# DYNAMIC GRID VISUALIZATION
# ==========================================

@app.route("/api/dynamic-grid")
def dynamic_grid():

    normal_images = get_random_images(
        "NORMAL",
        6
    )

    pneumonia_images = get_random_images(
        "PNEUMONIA",
        6
    )

    plt.figure(figsize=(12,6))

    for i, image_path in enumerate(normal_images):

        img = Image.open(image_path)

        plt.subplot(2,6,i+1)

        plt.imshow(
            img,
            cmap="gray"
        )

        plt.title("NORMAL")
        plt.axis("off")

    for i, image_path in enumerate(pneumonia_images):

        img = Image.open(image_path)

        plt.subplot(2,6,i+7)

        plt.imshow(
            img,
            cmap="gray"
        )

        plt.title("PNEUMONIA")
        plt.axis("off")

    plt.tight_layout()

    buffer = io.BytesIO()

    plt.savefig(
        buffer,
        format="png"
    )

    buffer.seek(0)

    plt.close()

    return send_file(
        buffer,
        mimetype="image/png"
    )

# ==========================================
# PIXEL INTENSITY DISTRIBUTION
# ==========================================

@app.route("/api/pixel-distribution")
def pixel_distribution():

    normal_pixels = []
    pneumonia_pixels = []

    normal_files = get_random_images(
        "NORMAL",
        20
    )

    pneumonia_files = get_random_images(
        "PNEUMONIA",
        20
    )

    for image_path in normal_files:

        img = cv2.imread(
            image_path,
            cv2.IMREAD_GRAYSCALE
        )

        img = cv2.resize(
            img,
            (128,128)
        )

        normal_pixels.extend(
            img.flatten()
        )

    for image_path in pneumonia_files:

        img = cv2.imread(
            image_path,
            cv2.IMREAD_GRAYSCALE
        )

        img = cv2.resize(
            img,
            (128,128)
        )

        pneumonia_pixels.extend(
            img.flatten()
        )

    plt.figure(figsize=(8,5))

    plt.hist(
        normal_pixels,
        bins=50,
        alpha=0.6,
        label="NORMAL"
    )

    plt.hist(
        pneumonia_pixels,
        bins=50,
        alpha=0.6,
        label="PNEUMONIA"
    )

    plt.legend()

    plt.title(
        "Pixel Intensity Distribution"
    )

    plt.xlabel(
        "Pixel Intensity"
    )

    plt.ylabel(
        "Frequency"
    )

    buffer = io.BytesIO()

    plt.savefig(
        buffer,
        format="png"
    )

    buffer.seek(0)

    plt.close()

    return send_file(
        buffer,
        mimetype="image/png"
    )

# ==========================================
# RESOLUTION SCATTER PLOT
# ==========================================

@app.route("/api/resolution-plot")
def resolution_plot():

    widths = []
    heights = []

    for cls in CLASSES:

        image_files = get_random_images(
            cls,
            50
        )

        for image_path in image_files:

            try:

                width, height = get_image_size(
                    image_path
                )

                widths.append(width)
                heights.append(height)

            except:
                pass

    plt.figure(figsize=(8,5))

    plt.scatter(
        widths,
        heights
    )

    plt.xlabel("Width")
    plt.ylabel("Height")

    plt.title(
        "Resolution Analysis"
    )

    buffer = io.BytesIO()

    plt.savefig(
        buffer,
        format="png"
    )

    buffer.seek(0)

    plt.close()

    return send_file(
        buffer,
        mimetype="image/png"
    )

# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":
    app.run(debug=True)