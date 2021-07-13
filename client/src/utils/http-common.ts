import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://imimap.f4.htw-berlin.de/api-proxy/api',
  headers: {
    'Content-type': 'application/json',
  },
});

export default apiClient;
