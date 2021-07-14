import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:9000/api',
  headers: {
    'Content-type': 'application/json',
  },
});

export default apiClient;
