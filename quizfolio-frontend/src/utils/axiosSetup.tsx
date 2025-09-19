// src/utils/axiosSetup.ts
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';

export const useAxiosSetup = () => {
  const { token, logout } = useContext(AuthContext);

  axios.defaults.baseURL = 'http://localhost:5000/api';

  axios.interceptors.request.use((config) => {
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );
};
