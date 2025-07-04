import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthUser, LoginCredentials, AuthResponse } from '../types/api.types';
import api from '../services/api';
import { AUTH_CONFIG } from '../utils/constants';

// Tipos para el contexto de autenticación
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshToken: () => Promise<void>;
}

// Estado inicial
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Tipos de acciones
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: AuthUser; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer para manejar el estado de autenticación
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props del proveedor
interface AuthProviderProps {
  children: ReactNode;
}

// Proveedor del contexto
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Función para inicializar la autenticación desde localStorage
  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
      const userData = localStorage.getItem(AUTH_CONFIG.userKey);

      if (token && userData) {
        const user = JSON.parse(userData);
        
        // Verificar que el token sigue siendo válido
        api.setAuthToken(token);
        
        // Opcional: verificar con el backend que el token es válido
        try {
          const response = await api.post<{ user: AuthUser }>('/auth/validate-token');
          if (response.success && response.data) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: { user: response.data.user, token }
            });
          } else {
            throw new Error('Token inválido');
          }
        } catch (error) {
          // Si el token no es válido, limpiar localStorage
          localStorage.removeItem(AUTH_CONFIG.tokenKey);
          localStorage.removeItem(AUTH_CONFIG.userKey);
          api.removeAuthToken();
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Función de login
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      if (response.success && response.data) {
        const { token, user } = response.data;

        // Guardar en localStorage
        localStorage.setItem(AUTH_CONFIG.tokenKey, token);
        localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(user));

        // Configurar token en API
        api.setAuthToken(token);

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token }
        });
      } else {
        throw new Error(response.message || 'Error en el login');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error de conexión';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      // Notificar al backend (opcional)
      if (state.isAuthenticated) {
        await api.post('/auth/logout').catch(() => {
          // Ignorar errores del backend en logout
        });
      }
    } finally {
      // Limpiar localStorage y estado
      localStorage.removeItem(AUTH_CONFIG.tokenKey);
      localStorage.removeItem(AUTH_CONFIG.userKey);
      api.removeAuthToken();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Función para refrescar token (si se implementa en el backend)
  const refreshToken = async () => {
    try {
      if (!state.token) {
        throw new Error('No hay token para refrescar');
      }

      const response = await api.post<{ token: string }>('/auth/refresh-token');
      
      if (response.success && response.data) {
        const newToken = response.data.token;
        
        // Actualizar localStorage
        localStorage.setItem(AUTH_CONFIG.tokenKey, newToken);
        
        // Configurar nuevo token en API
        api.setAuthToken(newToken);

        // Actualizar estado con nuevo token
        if (state.user) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: state.user, token: newToken }
          });
        }
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Si falla el refresh, hacer logout
      logout();
    }
  };

  // Inicializar autenticación al montar el componente
  useEffect(() => {
    initializeAuth();
  }, []);

  // Configurar interceptor para manejar errores 401 automáticamente
  useEffect(() => {
    const interceptor = api.setAuthToken; // Esto ya está configurado en api.ts
    // El interceptor ya maneja los errores 401 automáticamente
    
    return () => {
      // Cleanup si es necesario
    };
  }, []);

  // Valor del contexto
  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
  }
  
  return context;
}