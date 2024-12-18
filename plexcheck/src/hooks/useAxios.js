import axios from 'axios';
import { useAuthStore } from './stores/auth';
import router from './router';

const api = axios.create({
  baseURL: 'https://plextime.plexus.services',
  
});
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const token = authStore.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  const authStore = useAuthStore();

  if (error.response && error.response.status === 401) {   
    authStore.logout(); 
    router.push({ name: 'login' }); 
  }

  return Promise.reject(error);
});

export default api;
