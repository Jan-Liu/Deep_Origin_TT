import axios from "axios";

/**
 * Configured Axios instance with base URL and authentication interceptor
 * @type {axios.AxiosInstance}
 */
const api = axios.create({
  baseURL: "http://localhost:5000",
});

/**
 * Request interceptor for handling authentication tokens
 * @function requestInterceptor
 * @param {axios.AxiosRequestConfig} config - The request configuration object
 * @returns {axios.AxiosRequestConfig} Modified request configuration
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;