import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class DashboardService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api/dashboards`,
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async createDashboard(name: string, description?: string) {
    const response = await this.api.post('/', {
      name,
      description,
    });
    return response.data;
  }

  async getDashboards() {
    const response = await this.api.get('/');
    return response.data;
  }

  async getDashboardById(id: string) {
    const response = await this.api.get(`/${id}`);
    return response.data;
  }

  async updateDashboard(
    id: string,
    { name, description, widgets, layout }: any
  ) {
    const response = await this.api.put(`/${id}`, {
      name,
      description,
      widgets,
      layout,
    });
    return response.data;
  }

  async deleteDashboard(id: string) {
    const response = await this.api.delete(`/${id}`);
    return response.data;
  }

  async addWidget(dashboardId: string, widget: any) {
    const response = await this.api.post(`/${dashboardId}/widgets`, {
      widget,
    });
    return response.data;
  }

  async removeWidget(dashboardId: string, widgetId: string) {
    const response = await this.api.delete(`/${dashboardId}/widgets/${widgetId}`);
    return response.data;
  }
}

export default new DashboardService();
