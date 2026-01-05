import axios from 'axios';
import { Platform } from 'react-native';

// Use local computer IP address if testing on a physical device.
// 10.0.2.2 is the localhost address for Android emulator.
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://10.160.42.55:8000';

const client = axios.create({
    baseURL: BASE_URL,
    timeout: 60000, // Summarization can take a while
});

export const transcribeVideo = async (youtubeUrl) => {
    const response = await client.post('/transcribe', { youtube_url: youtubeUrl });
    return response.data;
};

export const summarizeVideo = async (youtubeUrl) => {
    const response = await client.post('/summarize', { youtube_url: youtubeUrl });
    return response.data;
};

export default client;
