import axios, { AxiosInstance } from 'axios';

const BASE_URL = `${process.env.API_HOST ?? 'http://localhost:9000'}/api`;

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-type': 'application/json',
  },
});

export default apiClient;
