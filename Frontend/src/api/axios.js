import axios from 'axios';

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This ensures cookies are sent with every request
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If the backend rejects the request due to missing/expired cookie, force redirect
      const isApiAdminRoute = error.config.url.includes('/admin');
      
      // We don't redirect if we are already on the login page to prevent infinite loops
      if (window.location.pathname !== '/admin/login' && window.location.pathname !== '/login') {
         if (isApiAdminRoute || window.location.pathname.startsWith('/admin')) {
             window.location.href = '/admin/login';
         } else {
             window.location.href = '/login';
         }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
