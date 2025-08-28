import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // ============ AUTH ============
  async login(email: string, password: string) {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  async register(username: string, email: string, password: string, role: string = 'viewer') {
    const response = await api.post('/api/auth/register', { 
      username, 
      email, 
      password, 
      role 
    });
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  async updateProfile(data: any) {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  },

  async logout() {
    const response = await api.post('/api/auth/logout');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    return response.data;
  },

  // ============ CATEGORIES ============
  async getCategories(params?: any) {
    const response = await api.get('/api/categories', { params });
    return response.data;
  },

  async getCategoryHierarchy() {
    const response = await api.get('/api/categories/hierarchy');
    return response.data;
  },

  async getCategoryById(id: string) {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },

  async createCategory(data: any) {
    const response = await api.post('/api/categories', data);
    return response.data;
  },

  async updateCategory(id: string, data: any) {
    const response = await api.put(`/api/categories/${id}`, data);
    return response.data;
  },

  async deleteCategory(id: string) {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data;
  },

  // ============ TECHNIQUES ============
  async getTechniques(params?: any) {
    const response = await api.get('/api/techniques', { params });
    return response.data;
  },

  async getTechniqueById(id: string) {
    const response = await api.get(`/api/techniques/${id}`);
    return response.data;
  },

  async getTechniquesByCategory(categoryId: string, params?: any) {
    const response = await api.get(`/api/techniques/category/${categoryId}`, { params });
    return response.data;
  },

  async createTechnique(data: any, files?: any) {
    const formData = new FormData();
    
    // Agregar datos JSON
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        data[key].forEach((item: any) => formData.append(`${key}[]`, item));
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });
    
    // Agregar archivos si existen
    if (files) {
      if (files.image) formData.append('image', files.image);
      if (files.document) formData.append('document', files.document);
    }
    
    const response = await api.post('/api/techniques', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateTechnique(id: string, data: any, files?: any) {
    const formData = new FormData();
    
    // Agregar datos JSON
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        data[key].forEach((item: any) => formData.append(`${key}[]`, item));
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });
    
    // Agregar archivos si existen
    if (files) {
      if (files.image) formData.append('image', files.image);
      if (files.document) formData.append('document', files.document);
    }
    
    const response = await api.put(`/api/techniques/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteTechnique(id: string) {
    const response = await api.delete(`/api/techniques/${id}`);
    return response.data;
  },

  async duplicateTechnique(id: string) {
    const response = await api.post(`/api/techniques/${id}/duplicate`);
    return response.data;
  },

  async searchTechniques(params: any) {
    const response = await api.get('/api/techniques/search', { params });
    return response.data;
  },

  async getTechniqueStats() {
    const response = await api.get('/api/techniques/stats');
    return response.data;
  },

  async exportTechniques(params?: any) {
    const response = await api.get('/api/techniques/export', { params });
    return response.data;
  },

  // ============ HEALTH CHECK ============
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  },
};

export default apiService;