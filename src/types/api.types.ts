// Tipos base de la API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Usuario autenticado
export interface AuthUser {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

// Respuesta de autenticación
export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// Credenciales de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Datos del creador
export interface CreatedBy {
  _id: string;
  username: string;
  email: string;
}

// Filtros base
export interface BaseFilters {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

// Estado de carga
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Configuración de la API
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}