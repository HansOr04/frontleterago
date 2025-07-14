import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiConfig } from '../types/api.types';

// Configuración base de la API
const API_CONFIG: ApiConfig = {
  baseURL: 'https://leteragoback.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Crear instancia de axios
const apiClient: AxiosInstance = axios.create(API_CONFIG);

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }

    // Manejar otros errores de la API
    const apiError = {
      message: error.response?.data?.message || 'Error de conexión',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors || [],
    };

    return Promise.reject(apiError);
  }
);

// Clase API para manejar todas las peticiones
class API {
  // Métodos GET
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.get<ApiResponse<T>>(endpoint, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Métodos POST
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.post<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Métodos PUT
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.put<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Métodos DELETE
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.delete<ApiResponse<T>>(endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Métodos PATCH
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.patch<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Manejar errores
  private handleError(error: any) {
    if (error.response) {
      // Error de respuesta del servidor
      return {
        message: error.response.data?.message || 'Error del servidor',
        status: error.response.status,
        errors: error.response.data?.errors || [],
      };
    } else if (error.request) {
      // Error de red
      return {
        message: 'Error de conexión. Verifica tu conexión a internet.',
        status: 0,
        errors: ['Error de red'],
      };
    } else {
      // Error de configuración
      return {
        message: error.message || 'Error desconocido',
        status: 500,
        errors: [error.message],
      };
    }
  }

  // Configurar token de autenticación
  setAuthToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  // Remover token de autenticación
  removeAuthToken() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  // Verificar si hay token
  hasAuthToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // Obtener token actual
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Health check de la API
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response.success;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Exportar instancia singleton
export const api = new API();
export default api;