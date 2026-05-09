import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000') + '/api/admin';

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
