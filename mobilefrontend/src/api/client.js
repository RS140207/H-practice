import axios from 'axios';
import { Platform } from 'react-native';

// Use local computer IP address if testing on a physical device.
// 10.0.2.2 is the localhost address for Android emulator.
// 192.168.1.14 is your computer's local network IP
const BASE_URL = Platform.OS === 'android' ? 'http://192.168.1.14:8000' : 'http://10.0.2.2:8000';

const client = axios.create({
    baseURL: BASE_URL,
    timeout: 60000, // Summarization can take a while
});

// Add request interceptor for debugging
client.interceptors.request.use(
    (config) => {
        console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
        console.log('📍 Full URL:', config.baseURL + config.url);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
client.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            console.error('❌ Server Error:', error.response.status, error.response.data);
        } else if (error.request) {
            // Request made but no response
            console.error('❌ Network Error - No response received');
            console.error('📍 Attempted URL:', error.config?.baseURL + error.config?.url);
            console.error('💡 Make sure backend is running on:', BASE_URL);
        } else {
            console.error('❌ Request Setup Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export const transcribeVideo = async (youtubeUrl) => {
    const response = await client.post('/transcribe', { youtube_url: youtubeUrl });
    return response.data;
};

export const summarizeVideo = async (youtubeUrl) => {
    const response = await client.post('/summarize', { youtube_url: youtubeUrl });
    return response.data;
};

export default client;
