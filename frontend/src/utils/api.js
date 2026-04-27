import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: false
});

// Token attach કરો
API.interceptors.request.use((config) => {
  let token = localStorage.getItem('pathfinder_token');

  // JSON parse જો જરૂર હોય
  if (token) {
    try {
      const parsed = JSON.parse(token);
      if (typeof parsed === 'string') token = parsed;
    } catch {
      // string જ છે - ઠીક છે
    }
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 401 handle કરો
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pathfinder_token');
      localStorage.removeItem('pathfinder_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;