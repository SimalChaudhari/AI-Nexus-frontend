import axios from 'axios';

import { CONFIG } from 'src/config-global';
import { STORAGE_KEY } from 'src/auth/context/jwt/constant';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

// Request interceptor to add JWT token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem(STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle connection refused errors
    if (error.code === 'ECONNREFUSED' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
      const connectionError = new Error('Unable to connect to server. Please make sure the backend server is running on http://localhost:3000');
      connectionError.code = 'ECONNREFUSED';
      return Promise.reject(connectionError);
    }
    
    // Handle network errors
    if (error.message === 'Network Error' || !error.response) {
      const networkError = new Error('Network error. Please check your internet connection and ensure the server is running.');
      networkError.code = 'NETWORK_ERROR';
      return Promise.reject(networkError);
    }
    
    // Handle other errors
    const errorMessage = (error.response && error.response.data) || error.message || 'Something went wrong!';
    const finalError = errorMessage instanceof Error 
      ? errorMessage 
      : new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    return Promise.reject(finalError);
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
    google: {
      redirect: '/api/auth/google/redirect'
    }
  },
};
