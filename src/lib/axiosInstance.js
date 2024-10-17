import axios from 'axios';
import { BASE_URL } from './constants';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


const tokenInterceptor = async (config) => {
    const token = localStorage.getItem('token_app_wpl');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}

axiosInstance.interceptors.request.use(tokenInterceptor, Promise.reject);

export { axiosInstance };

export default axiosInstance;
