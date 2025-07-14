// Categorías de normativas (deben coincidir con el backend)
export const NORMATIVAS_CATEGORIES = [
  'Organización y Contexto',
  'Liderazgo', 
  'Planificación',
  'Soporte',
  'Operación',
  'Evaluación del Desempeño',
  'Mejora'
] as const;

// Categorías de anexos SOA (deben coincidir con el backend)
export const ANEXOS_SOA_CATEGORIES = [
  'Controles Organizacionales',
  'Controles de Personas',
  'Controles Físicos', 
  'Controles Tecnológicos'
] as const;

// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'Leterago - Normativas SOA',
  version: '1.0.0',
  description: 'Sistema de gestión de normativas y anexos SOA',
  api: {
    baseURL: 'https://leteragoback.onrender.com',
    timeout: 10000,
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  }
} as const;

// Configuración de autenticación
export const AUTH_CONFIG = {
  tokenKey: 'auth_token',
  userKey: 'user_data',
  refreshThreshold: 5 * 60 * 1000, // 5 minutos antes de expirar
} as const;

// Estados de normativas
export const NORMATIVA_ESTADOS = {
  VIGENTE: 'vigente',
  PROXIMA: 'proxima', 
  CRITICA: 'critica',
  VENCIDA: 'vencida'
} as const;

// Colores para los estados de normativas
export const ESTADO_COLORS = {
  vigente: 'bg-green-100 text-green-800',
  proxima: 'bg-yellow-100 text-yellow-800',
  critica: 'bg-orange-100 text-orange-800',
  vencida: 'bg-red-100 text-red-800'
} as const;

// Mapeo de colores para categorías de normativas
export const NORMATIVA_CATEGORY_COLORS = [
  'normativa-cat-1', // Organización y Contexto
  'normativa-cat-2', // Liderazgo
  'normativa-cat-3', // Planificación  
  'normativa-cat-4', // Soporte
  'normativa-cat-5', // Operación
  'normativa-cat-6', // Evaluación del Desempeño
  'normativa-cat-7'  // Mejora
] as const;

// Mapeo de colores para categorías de anexos SOA
export const ANEXO_CATEGORY_COLORS = [
  'matrix-org',    // Controles Organizacionales
  'matrix-people', // Controles de Personas
  'matrix-physical', // Controles Físicos
  'matrix-tech'    // Controles Tecnológicos
] as const;

// Configuración de la matriz SOA
export const SOA_MATRIX_CONFIG = {
  categories: ANEXOS_SOA_CATEGORIES,
  colors: ANEXO_CATEGORY_COLORS,
  minCellHeight: '120px',
  responsive: {
    mobile: '80px',
    tablet: '100px',
    desktop: '120px'
  }
} as const;

// Configuración de la matriz de normativas
export const NORMATIVAS_MATRIX_CONFIG = {
  categories: NORMATIVAS_CATEGORIES,
  colors: NORMATIVA_CATEGORY_COLORS,
  minCellHeight: '100px',
  responsive: {
    mobile: '80px',
    tablet: '90px', 
    desktop: '100px'
  }
} as const;

// Componentes de arquitectura SOC
export const SOC_COMPONENTS = [
  {
    id: 'checkpoint',
    name: 'CHECKPOINT',
    class: 'soc-checkpoint',
    position: 'top'
  },
  {
    id: 'threat-intelligence',
    name: 'Threat Intelligence y Hunting de Amenazas',
    class: 'soc-threat',
    position: 'top-right'
  },
  {
    id: 'soc-center',
    name: 'SOC',
    class: 'soc-center',
    position: 'center'
  },
  {
    id: 'trellix',
    name: 'TRELLIX',
    class: 'soc-trellix',
    position: 'left'
  },
  {
    id: 'azure-sentinel',
    name: 'Azure Sentinel',
    class: 'soc-azure',
    position: 'right'
  },
  {
    id: 'checkpoint-infinity',
    name: 'CHECKPOINT INFINITY PORTAL',
    class: 'soc-checkpoint',
    position: 'bottom'
  }
] as const;

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  NORMAS: '/normas',
  ANEXOS: '/anexos',
  ARQUITECTURA: '/arquitectura'
} as const;

// Mensajes de la aplicación
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Inicio de sesión exitoso',
    LOGOUT: 'Sesión cerrada exitosamente',
    CREATE: 'Elemento creado exitosamente',
    UPDATE: 'Elemento actualizado exitosamente',
    DELETE: 'Elemento eliminado exitosamente'
  },
  ERROR: {
    GENERIC: 'Ha ocurrido un error inesperado',
    NETWORK: 'Error de conexión. Verifica tu conexión a internet.',
    UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
    NOT_FOUND: 'El elemento solicitado no fue encontrado',
    VALIDATION: 'Por favor verifica los datos ingresados'
  },
  LOADING: {
    DEFAULT: 'Cargando...',
    NORMATIVAS: 'Cargando normativas...',
    ANEXOS: 'Cargando anexos SOA...',
    STATS: 'Cargando estadísticas...'
  }
} as const;

// Configuración de validación
export const VALIDATION = {
  NORMATIVA: {
    NOMBRE: { min: 3, max: 200 },
    DESCRIPCION: { min: 10, max: 1000 },
    UBICACION: { min: 1, max: 500 }
  },
  ANEXO: {
    NOMBRE_CONTROL: { min: 3, max: 200 },
    DESCRIPCION: { min: 10, max: 2000 },
    UBICACION: { min: 1, max: 500 },
    OBSERVACIONES: { max: 1000 }
  },
  USER: {
    USERNAME: { min: 3, max: 20 },
    PASSWORD: { min: 6 },
    EMAIL: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
  }
} as const;

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['application/pdf', 'application/msword', 'text/plain'],
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.txt']
} as const;

// Configuración de fecha y hora
export const DATE_CONFIG = {
  LOCALE: 'es-ES',
  TIMEZONE: 'America/Guayaquil',
  FORMATS: {
    DATE: 'dd/MM/yyyy',
    DATETIME: 'dd/MM/yyyy HH:mm',
    TIME: 'HH:mm'
  }
} as const;

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMITS: [10, 25, 50, 100],
  MAX_LIMIT: 100
} as const;

// Roles de usuario
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
} as const;

// Configuración de búsqueda
export const SEARCH_CONFIG = {
  MIN_CHARS: 2,
  DEBOUNCE_TIME: 300,
  MAX_RESULTS: 50
} as const;

// Iconos para diferentes elementos
export const ICONS = {
  NORMATIVAS: 'FileText',
  ANEXOS: 'Shield',
  ARQUITECTURA: 'Network',
  STATS: 'BarChart3',
  SETTINGS: 'Settings',
  USER: 'User',
  LOGOUT: 'LogOut',
  SEARCH: 'Search',
  FILTER: 'Filter',
  EXPORT: 'Download',
  ADD: 'Plus',
  EDIT: 'Edit',
  DELETE: 'Trash2',
  VIEW: 'Eye'
} as const;

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  DURATION: 5000, // 5 segundos
  POSITION: 'top-right',
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  }
} as const;

// Estados de carga
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

// Configuración de tema
export const THEME_CONFIG = {
  PRIMARY: '#1e3a8a',
  SECONDARY: '#3b82f6',
  ACCENT: '#e91e63',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6'
} as const;

// Breakpoints responsive
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
} as const;

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms'
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out'
  }
} as const;

// Tipos derivados
export type NormativaCategoria = typeof NORMATIVAS_CATEGORIES[number];
export type AnexoSOACategoria = typeof ANEXOS_SOA_CATEGORIES[number];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type EstadoNormativa = typeof NORMATIVA_ESTADOS[keyof typeof NORMATIVA_ESTADOS];
export type LoadingState = typeof LOADING_STATES[keyof typeof LOADING_STATES];
export type NotificationType = typeof NOTIFICATION_CONFIG.TYPES[keyof typeof NOTIFICATION_CONFIG.TYPES];