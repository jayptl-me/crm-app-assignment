import api from './api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data));
        console.log('Login successful. Token saved:', response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    console.log('Checking authentication, token:', token);
    return !!token;
  }
};

export default authService;
