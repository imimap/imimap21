import axios, { AxiosInstance } from 'axios';

export const API_HOST = process.env.API_HOST ?? 'http://localhost:9000';

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_HOST}/api`,
  headers: {
    'Content-type': 'application/json',
  },
});

export default apiClient;
