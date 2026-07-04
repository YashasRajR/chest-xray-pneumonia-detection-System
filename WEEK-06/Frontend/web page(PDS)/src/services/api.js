import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

const api = axios.create({
    baseURL: API_URL,
});

/**
 * Sends a chest X-ray image to the backend for pneumonia prediction.
 * @param {File} file - The image file to upload
 * @returns {Promise<Object>} - The prediction result (prediction, confidence)
 */
export const predictImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post('/predict', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data; // { prediction: 'Pneumonia' | 'Normal', confidence: 96.42 }
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code outside of 2xx
            throw new Error(error.response.data.error || 'Server error occurred during prediction.');
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('Server offline or unreachable. Please ensure the backend is running.');
        } else {
            // Something happened in setting up the request
            throw new Error('An unexpected error occurred while making the request.');
        }
    }
};
