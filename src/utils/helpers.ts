import { EstadoNormativa } from '../types/normativas.types';
import { ESTADO_COLORS } from './constants';

/**
 * Funciones helper para el frontend
 */

// Formateo de fechas
export const formatDate = (date: Date | string | undefined, options?: Intl.DateTimeFormatOptions): string => {
  if (!date) return 'No disponible';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Fecha inválida';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return dateObj.toLocaleDateString('es-ES', options || defaultOptions);
};

// Formateo de fecha y hora
export const formatDateTime = (date: Date | string | undefined): string => {
  return formatDate(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Formateo de fecha corta
export const formatDateShort = (date: Date | string | undefined): string => {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Calcular días hasta una fecha
export const calculateDaysUntil = (targetDate: Date | string): number => {
  const today = new Date();
  const target = new Date(targetDate);
  const timeDiff = target.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// Determinar estado de normativa basado en fecha de vencimiento
export const getNormativaStatus = (fechaVencimiento: Date | string): {
  estado: EstadoNormativa;
  diasRestantes: number;
  color: string;
} => {
  const diasRestantes = calculateDaysUntil(fechaVencimiento);
  
  let estado: EstadoNormativa;
  if (diasRestantes < 0) {
    estado = 'vencida';
  } else if (diasRestantes <= 7) {
    estado = 'critica';
  } else if (diasRestantes <= 30) {
    estado = 'proxima';
  } else {
    estado = 'vigente';
  }
  
  return {
    estado,
    diasRestantes,
    color: ESTADO_COLORS[estado],
  };
};

// Formatear texto de estado legible
export const formatEstadoText = (estado: EstadoNormativa, diasRestantes: number): string => {
  switch (estado) {
    case 'vencida':
      return `Vencida hace ${Math.abs(diasRestantes)} días`;
    case 'critica':
      return `Vence en ${diasRestantes} días (CRÍTICO)`;
    case 'proxima':
      return `Vence en ${diasRestantes} días`;
    case 'vigente':
      return `${diasRestantes} días restantes`;
    default:
      return 'Estado desconocido';
  }
};

// Capitalizar primera letra
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

// Formatear número con separadores de miles
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-ES').format(num);
};

// Formatear porcentaje
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Generar color basado en índice para matriz
export const getMatrixColor = (index: number, colorArray: readonly string[]): string => {
  return colorArray[index % colorArray.length];
};

// Filtrar array por término de búsqueda
export const filterBySearch = <T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) return items;
  
  const lowercaseSearch = searchTerm.toLowerCase();
  
  return items.filter(item =>
    searchFields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowercaseSearch);
      }
      return false;
    })
  );
};

// Agrupar array por campo
export const groupBy = <T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

// Ordenar array por campo
export const sortBy = <T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Validar email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar campos requeridos
export const validateRequired = (
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors.push(`El campo ${field} es requerido`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Generar ID único simple
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Convertir objeto a query string
export const objectToQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};

// Parsear query string a objeto
export const queryStringToObject = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};

// Limpiar objeto removiendo valores undefined/null
export const cleanObject = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const cleaned: Partial<T> = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      cleaned[key as keyof T] = value;
    }
  });
  
  return cleaned;
};

// Copiar texto al portapapeles
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback para navegadores más antiguos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

// Detectar dispositivo móvil
export const isMobile = (): boolean => {
  return window.innerWidth <= 768;
};

// Detectar si es modo oscuro del sistema
export const prefersDarkMode = (): boolean => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Scroll suave a elemento
export const scrollToElement = (elementId: string, offset: number = 0): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    });
  }
};

// Formatear tamaño de archivo
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Obtener iniciales de nombre
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Generar color basado en string (para avatares)
export const getColorFromString = (str: string): string => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-gray-500',
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Manejar errores de API de forma consistente
export const handleApiError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  return 'Ha ocurrido un error inesperado';
};

// Formatear duración en tiempo legible
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);
  
  return parts.join(' ');
};

// Crear un delay/sleep
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Retry con backoff exponencial
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await sleep(delay);
    }
  }
  
  throw lastError;
};

// Funciones específicas para normativas y anexos

// Obtener prioridad de normativa basada en vencimiento
export const getNormativaPriority = (fechaVencimiento: Date | string): {
  priority: 'alta' | 'media' | 'baja';
  label: string;
  color: string;
} => {
  const diasRestantes = calculateDaysUntil(fechaVencimiento);
  
  if (diasRestantes < 0) {
    return {
      priority: 'alta',
      label: 'Vencida',
      color: 'text-red-600 bg-red-100',
    };
  } else if (diasRestantes <= 7) {
    return {
      priority: 'alta',
      label: 'Crítica',
      color: 'text-orange-600 bg-orange-100',
    };
  } else if (diasRestantes <= 30) {
    return {
      priority: 'media',
      label: 'Próxima',
      color: 'text-yellow-600 bg-yellow-100',
    };
  } else {
    return {
      priority: 'baja',
      label: 'Vigente',
      color: 'text-green-600 bg-green-100',
    };
  }
};

// Calcular progreso de cumplimiento
export const calculateComplianceProgress = (
  implemented: number,
  total: number
): {
  percentage: number;
  status: 'excellent' | 'good' | 'warning' | 'danger';
  color: string;
} => {
  const percentage = total > 0 ? Math.round((implemented / total) * 100) : 0;
  
  let status: 'excellent' | 'good' | 'warning' | 'danger';
  let color: string;
  
  if (percentage >= 90) {
    status = 'excellent';
    color = 'text-green-600 bg-green-100';
  } else if (percentage >= 70) {
    status = 'good';
    color = 'text-blue-600 bg-blue-100';
  } else if (percentage >= 50) {
    status = 'warning';
    color = 'text-yellow-600 bg-yellow-100';
  } else {
    status = 'danger';
    color = 'text-red-600 bg-red-100';
  }
  
  return { percentage, status, color };
};