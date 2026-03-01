import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class PredictService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api/predict`,
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getForecast(datasetId: string, columnName: string, periods: number = 30) {
    const response = await this.api.post('/forecast', {
      datasetId,
      columnName,
      periods,
    });
    return response.data;
  }

  async getAnomalies(datasetId: string, columnName: string, sensitivity: number = 0.95) {
    const response = await this.api.post('/anomalies', {
      datasetId,
      columnName,
      sensitivity,
    });
    return response.data;
  }

  async getInsights(datasetId: string, columnName: string) {
    const response = await this.api.post('/insights', {
      datasetId,
      columnName,
    });
    return response.data;
  }

  async getPredictions(datasetId?: string) {
    const response = await this.api.get('/', {
      params: { datasetId },
    });
    return response.data;
  }

  async getPredictionById(id: string) {
    const response = await this.api.get(`/${id}`);
    return response.data;
  }
}

export default new PredictService();
