import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('akshar_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const registerUser = async (name, email, password, nickname, age, mobile, role) => {
    try {
        const response = await api.post('/register', { name, email, password, nickname, age, mobile, role });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Registration failed');
        }
        throw new Error('Server unreachable');
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Login failed');
        }
        throw new Error('Server unreachable');
    }
};

export const updateUser = async (userData) => {
    try {
        const response = await api.put('/api/user/update', userData);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Profile update failed');
        }
        throw new Error('Server unreachable');
    }
};

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

        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Server error occurred during prediction.');
        } else if (error.request) {
            throw new Error('Server offline or unreachable. Please ensure the backend is running.');
        } else {
            throw new Error('An unexpected error occurred while making the request.');
        }
    }
};

export const getHistory = async () => {
    try {
        const response = await api.get('/history');
        return response.data;
    } catch (error) {
        console.error("Error fetching history:", error);
        return [];
    }
};

export const deleteHistoryRecord = async (id) => {
    try {
        const response = await api.delete(`/history/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting record:", error);
        throw error;
    }
};

export const clearHistory = async () => {
    try {
        const response = await api.delete('/history');
        return response.data;
    } catch (error) {
        console.error("Error clearing history:", error);
        throw error;
    }
};

export const deleteAccount = async () => {
    try {
        const response = await api.delete('/api/user/delete');
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Failed to delete account');
        }
        throw new Error('Server unreachable');
    }
};

export const resetPasswordWithSecurityQuestion = async (email, nickname, newPassword) => {
    try {
        const response = await api.post('/api/forgot-password/reset', { email, nickname, newPassword });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Failed to process request');
        }
        throw new Error('Server unreachable');
    }
};
