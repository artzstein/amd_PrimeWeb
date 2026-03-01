import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api/auth`,
    });

    // Add token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async register(email: string, password: string, name: string) {
    const response = await this.api.post('/register', { email, password, name });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/login', { email, password });
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get('/me');
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export default new AuthService();
