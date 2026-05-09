import axios from 'axios';
import { BACKEND_BASE_URL } from '../../utils/env';

const BASE_URL = BACKEND_BASE_URL + '/api/admin';

const adminClient = axios.create({ baseURL: BASE_URL });

adminClient.interceptors.request.use((config) => {
  const key = localStorage.getItem('adminKey') ?? '';
  config.headers['x-admin-key'] = key;
  return config;
});

adminClient.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('adminKey');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default adminClient;
