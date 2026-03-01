import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class DatasetService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api/datasets`,
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async uploadDataset(file: File, name: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    const response = await this.api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async getDatasets() {
    const response = await this.api.get('/');
    return response.data;
  }

  async getDatasetById(id: string) {
    const response = await this.api.get(`/${id}`);
    return response.data;
  }

  async getDatasetData(id: string, limit: number = 100, skip: number = 0) {
    const response = await this.api.get(`/${id}/data?limit=${limit}&skip=${skip}`);
    return response.data;
  }

  async updateDataset(id: string, name: string) {
    const response = await this.api.put(`/${id}`, { name });
    return response.data;
  }

  async deleteDataset(id: string) {
    const response = await this.api.delete(`/${id}`);
    return response.data;
  }
}

export default new DatasetService();
