import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://imimap.f4.htw-berlin.de:9000/api',
  headers: {
    'Content-type': 'application/json',
  },
});

export default apiClient;
