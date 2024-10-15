import axios from 'axios';

export const BASE_URL = "http://139.59.58.53:3000"

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
