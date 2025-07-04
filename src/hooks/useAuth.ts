import { useAuthContext } from '../context/AuthContext';
import { LoginCredentials } from '../types/api.types';

// Hook personalizado para autenticación
export function useAuth() {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
    refreshToken
  } = useAuthContext();

  // Función de login con manejo de errores mejorado
  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Error en el login' 
      };
    }
  };

  // Función de logout con confirmación
  const handleLogout = async (confirmation = false) => {
    if (!confirmation) {
      const shouldLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
      if (!shouldLogout) return;
    }
    
    await logout();
  };

  // Verificar si el usuario es administrador
  const isAdmin = user?.role === 'admin';

  // Verificar si el usuario es regular
  const isUser = user?.role === 'user';

  // Obtener nombre para mostrar
  const displayName = user?.username || user?.email || 'Usuario';

  // Verificar si el token está próximo a expirar (opcional)
  const isTokenExpiring = () => {
    if (!token) return false;
    
    try {
      // Decodificar JWT para verificar expiración
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return false;
      
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = payload.exp;
      
      // Verificar si expira en los próximos 5 minutos
      const threshold = 5 * 60; // 5 minutos en segundos
      return (expirationTime - currentTime) < threshold;
    } catch (error) {
      console.warn('Error parsing token:', error);
      return false;
    }
  };

  // Auto-refresh del token si está próximo a expirar
  const autoRefreshToken = async () => {
    if (isTokenExpiring() && isAuthenticated) {
      try {
        await refreshToken();
      } catch (error) {
        console.error('Auto-refresh failed:', error);
        // El logout se maneja automáticamente en el contexto
      }
    }
  };

  return {
    // Estado
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    isAdmin,
    isUser,
    displayName,
    
    // Acciones
    login: handleLogin,
    logout: handleLogout,
    clearError,
    refreshToken,
    autoRefreshToken,
    
    // Utilidades
    isTokenExpiring,
  };
}