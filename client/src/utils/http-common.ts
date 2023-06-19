import axios, { AxiosInstance } from 'axios';

export const API_HOST = process.env.VUE_APP_API_HOST ?? 'http://localhost:9000'; // API calls are on the same address usually

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_HOST}/api`,
  headers: {
    'Content-type': 'application/json',
  },
});

export default apiClient;
