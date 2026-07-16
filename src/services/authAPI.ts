import { request, setAuthToken, clearAuthToken } from './api';

export const authAPI = {
  async login(credentials: { username: string; password: string }) {
    const data = await request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  async register(userData: { username: string; email: string; password: string; role: string }) {
    return request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async logout() {
    clearAuthToken();
    try {
      await request('/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Backend logout failed or not supported:', e);
    }
  },

  async getProfile() {
    return request('/profile');
  },

  async getUsers() {
    return request('/users');
  }
};
