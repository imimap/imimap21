import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: `${process.env.API_HOST}/api`,
  headers: {
    'Content-type': 'application/json',
  },
});

export default apiClient;
