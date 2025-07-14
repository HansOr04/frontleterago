import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, BarChart3, Plus, X, Calendar, MapPin, Save, AlertCircle } from 'lucide-react';

// Tipos e interfaces
interface CreatedBy {
  _id: string;
  username: string;
  email: string;
}

interface Normativa {
  _id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  ubicacion: string;
  fechaVencimiento: Date;
  createdBy: CreatedBy;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FormData {
  nombre: string;
  categoria: string;
  descripcion: string;
  ubicacion: string;
  fechaVencimiento: string;
}

interface FormErrors {
  [key: string]: string;
}

interface Stats {
  total: number;
  vencidas: number;
  proximasAVencer: number;
}

interface GroupedNormativa {
  categoria: string;
  normativas: Normativa[];
  colorClass: string;
  count: number;
}

interface NormativaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

interface NormativaDetailProps {
  normativa: Normativa;
  onClose: () => void;
}

// Constantes
const NORMATIVAS_CATEGORIES = [
  'Organización y Contexto',
  'Liderazgo', 
  'Planificación',
  'Soporte',
  'Operación',
  'Evaluación del Desempeño',
  'Mejora'
] as const;

// Componente NormativaDetail
const NormativaDetail: React.FC<NormativaDetailProps> = ({ normativa, onClose }) => {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'No disponible';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDaysUntilExpiration = () => {
    const today = new Date();
    const expiration = new Date(normativa.fechaVencimiento);
    const timeDiff = expiration.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getExpirationStatus = () => {
    const days = calculateDaysUntilExpiration();
    if (days < 0) return { status: 'vencida', color: 'red', icon: 'AlertTriangle' };
    if (days <= 7) return { status: 'crítica', color: 'orange', icon: 'AlertTriangle' };
    if (days <= 30) return { status: 'próxima a vencer', color: 'yellow', icon: 'AlertCircle' };
    return { status: 'vigente', color: 'green', icon: 'FileText' };
  };

  const expirationInfo = getExpirationStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Detalle de la Normativa
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Información principal */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              {normativa.nombre}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Categoría */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Categoría</span>
                </div>
                <p className="text-blue-700">{normativa.categoria}</p>
              </div>

              {/* Estado de vencimiento */}
              <div className={`${
                expirationInfo.color === 'red' ? 'bg-red-50 border-red-200' :
                expirationInfo.color === 'orange' ? 'bg-orange-50 border-orange-200' :
                expirationInfo.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              } border rounded-lg p-4`}>
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className={`w-4 h-4 ${
                    expirationInfo.color === 'red' ? 'text-red-600' :
                    expirationInfo.color === 'orange' ? 'text-orange-600' :
                    expirationInfo.color === 'yellow' ? 'text-yellow-600' :
                    'text-green-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    expirationInfo.color === 'red' ? 'text-red-800' :
                    expirationInfo.color === 'orange' ? 'text-orange-800' :
                    expirationInfo.color === 'yellow' ? 'text-yellow-800' :
                    'text-green-800'
                  }`}>
                    Estado
                  </span>
                </div>
                <p className={`${
                  expirationInfo.color === 'red' ? 'text-red-700' :
                  expirationInfo.color === 'orange' ? 'text-orange-700' :
                  expirationInfo.color === 'yellow' ? 'text-yellow-700' :
                  'text-green-700'
                } capitalize`}>
                  {expirationInfo.status}
                </p>
                <p className={`text-xs ${
                  expirationInfo.color === 'red' ? 'text-red-600' :
                  expirationInfo.color === 'orange' ? 'text-orange-600' :
                  expirationInfo.color === 'yellow' ? 'text-yellow-600' :
                  'text-green-600'
                } mt-1`}>
                  {calculateDaysUntilExpiration() >= 0 
                    ? `${calculateDaysUntilExpiration()} días restantes`
                    : `Vencida hace ${Math.abs(calculateDaysUntilExpiration())} días`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <h4 className="text-md font-medium text-gray-900">Descripción</h4>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {normativa.descripcion}
              </p>
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h4 className="text-md font-medium text-gray-900">Ubicación</h4>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{normativa.ubicacion}</p>
            </div>
          </div>

          {/* Fecha de vencimiento */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h4 className="text-md font-medium text-gray-900">Fecha de Vencimiento</h4>
            </div>
            <div className={`${
              expirationInfo.color === 'red' ? 'bg-red-50 border-red-200' :
              expirationInfo.color === 'orange' ? 'bg-orange-50 border-orange-200' :
              expirationInfo.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            } border rounded-lg p-4`}>
              <p className={`${
                expirationInfo.color === 'red' ? 'text-red-800' :
                expirationInfo.color === 'orange' ? 'text-orange-800' :
                expirationInfo.color === 'yellow' ? 'text-yellow-800' :
                'text-green-800'
              } font-medium`}>
                {formatDate(normativa.fechaVencimiento)}
              </p>
            </div>
          </div>

          {/* Información de creación */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Información de la Normativa
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Creado por */}
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-gray-300 mt-0.5 flex items-center justify-center">
                  <span className="text-xs text-gray-600">👤</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Creado por</p>
                  <p className="text-sm text-gray-600">{normativa.createdBy.username}</p>
                  <p className="text-xs text-gray-500">{normativa.createdBy.email}</p>
                </div>
              </div>

              {/* Fecha de creación */}
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Fecha de creación</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(normativa.createdAt)}
                  </p>
                  {normativa.updatedAt && normativa.updatedAt !== normativa.createdAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Actualizado: {formatDate(normativa.updatedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ID de la normativa (para referencia) */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">
              <span className="font-medium">ID de la Normativa:</span> {normativa._id}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente Modal para el formulario
const NormativaFormModal: React.FC<NormativaFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    categoria: '',
    descripcion: '',
    ubicacion: '',
    fechaVencimiento: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Resetear formulario cuando se abre
  useEffect(() => {
    if (isOpen) {
      setFormData({
        nombre: '',
        categoria: '',
        descripcion: '',
        ubicacion: '',
        fechaVencimiento: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = 'La ubicación es requerida';
    }

    if (!formData.fechaVencimiento) {
      newErrors.fechaVencimiento = 'La fecha de vencimiento es requerida';
    } else {
      const selectedDate = new Date(formData.fechaVencimiento);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        newErrors.fechaVencimiento = 'La fecha de vencimiento debe ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Llamar a la función real de creación
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      console.error('Error al crear normativa:', error);
      alert(error.message || 'Error al crear la normativa. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Nueva Normativa</h2>
              <p className="text-sm text-gray-600">Completa la información para crear una nueva normativa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <div className="p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Normativa *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ej: Política de Calidad 2024"
              disabled={isSubmitting}
            />
            {errors.nombre && (
              <div className="flex items-center mt-2 text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.nombre}</span>
              </div>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.categoria ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              <option value="">Selecciona una categoría</option>
              {NORMATIVAS_CATEGORIES.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <div className="flex items-center mt-2 text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.categoria}</span>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                errors.descripcion ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Describe el propósito y alcance de esta normativa..."
              disabled={isSubmitting}
            />
            {errors.descripcion && (
              <div className="flex items-center mt-2 text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.descripcion}</span>
              </div>
            )}
          </div>

          {/* Ubicación */}
          <div>
            <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación del Documento *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="ubicacion"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.ubicacion ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Ej: /documentos/calidad/politicas/politica-calidad-2024.pdf"
                disabled={isSubmitting}
              />
            </div>
            {errors.ubicacion && (
              <div className="flex items-center mt-2 text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.ubicacion}</span>
              </div>
            )}
          </div>

          {/* Fecha de Vencimiento */}
          <div>
            <label htmlFor="fechaVencimiento" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Vencimiento *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                id="fechaVencimiento"
                name="fechaVencimiento"
                value={formData.fechaVencimiento}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.fechaVencimiento ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
            </div>
            {errors.fechaVencimiento && (
              <div className="flex items-center mt-2 text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.fechaVencimiento}</span>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Crear Normativa</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal
const NormativasMatrix: React.FC = () => {
  const [normativas, setNormativas] = useState<Normativa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedNormativa, setSelectedNormativa] = useState<Normativa | null>(null);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    vencidas: 0,
    proximasAVencer: 0
  });

  // Función para cargar normativas desde la API
  const loadNormativas = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // URL base configurable - ajusta según tu setup
      const API_BASE_URL = 'https://leteragoback.onrender.com';
      const url = `${API_BASE_URL}/api/normativas`;
      
      console.log('Cargando normativas desde:', url);
      
      // Llamada a la API real
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Añadir token de autenticación si está disponible
          ...(localStorage.getItem('auth_token') && {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          })
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        // Intentar leer la respuesta como texto para debug
        const responseText = await response.text();
        console.error('Error response:', responseText);
        
        if (response.status === 404) {
          throw new Error('La ruta /api/normativas no fue encontrada. Verifica que el servidor esté ejecutándose correctamente.');
        } else if (response.status === 401) {
          throw new Error('No autorizado. Verifica tu token de autenticación.');
        } else if (response.status === 500) {
          throw new Error('Error interno del servidor. Revisa los logs del backend.');
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Response is not JSON:', responseText.substring(0, 200));
        throw new Error('El servidor no devolvió JSON válido. Verifica que la API esté configurada correctamente.');
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success && data.data) {
        // Manejar diferentes estructuras de respuesta
        let normativasData: Normativa[] = [];
        
        if (Array.isArray(data.data)) {
          // Si data es directamente un array
          normativasData = data.data;
        } else if (data.data.normativas && Array.isArray(data.data.normativas)) {
          // Si data tiene una propiedad normativas que es un array
          normativasData = data.data.normativas;
        } else if (data.data.data && Array.isArray(data.data.data)) {
          // Si hay una estructura anidada
          normativasData = data.data.data;
        } else {
          console.error('Estructura de respuesta inesperada:', data);
          throw new Error('Formato de respuesta inesperado del servidor');
        }

        // Convertir fechas de string a Date objects
        const processedNormativas = normativasData.map((normativa: any) => ({
          ...normativa,
          fechaVencimiento: new Date(normativa.fechaVencimiento),
          createdAt: normativa.createdAt ? new Date(normativa.createdAt) : undefined,
          updatedAt: normativa.updatedAt ? new Date(normativa.updatedAt) : undefined
        }));

        setNormativas(processedNormativas);
        console.log(`Cargadas ${processedNormativas.length} normativas exitosamente`);
        
      } else {
        throw new Error(data.message || 'No se recibieron datos válidos del servidor');
      }
    } catch (err: any) {
      console.error('Error loading normativas:', err);
      
      // Mejorar mensajes de error para el usuario
      let userMessage = 'Error al cargar las normativas';
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        userMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
      } else if (err.message.includes('JSON')) {
        userMessage = 'Error de comunicación con el servidor. El servidor puede estar devolviendo HTML en lugar de datos.';
      } else {
        userMessage = err.message || userMessage;
      }
      
      setError(userMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cargar normativas al montar el componente
  useEffect(() => {
    loadNormativas();
  }, []);

  // Función para calcular días hasta vencimiento
  const calculateDaysUntil = (fechaVencimiento: Date): number => {
    const today = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const timeDiff = vencimiento.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // Función para obtener color mejorado
  const getImprovedColorClass = (index: number): string => {
    const improvedColors = [
      'from-blue-600 to-blue-700',
      'from-indigo-600 to-indigo-700',
      'from-purple-600 to-purple-700',
      'from-cyan-600 to-cyan-700',
      'from-teal-600 to-teal-700',
      'from-emerald-600 to-emerald-700',
      'from-blue-700 to-blue-800',
    ];
    return improvedColors[index % improvedColors.length];
  };

  // Función para obtener estado de vencimiento
  const getEstadoVencimiento = (fechaVencimiento: Date): string => {
    const diasHasta = calculateDaysUntil(fechaVencimiento);
    
    if (diasHasta < 0) return 'vencida';
    if (diasHasta <= 7) return 'critica';
    if (diasHasta <= 30) return 'proxima';
    return 'vigente';
  };

  // Agrupar normativas por categoría
  const groupedNormativas: GroupedNormativa[] = NORMATIVAS_CATEGORIES.map((categoria, index) => {
    const categoriaNormativas = normativas.filter(normativa => {
      const matchesCategory = normativa.categoria === categoria;
      const matchesSearch = !searchTerm || 
        normativa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        normativa.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = !selectedCategory || categoria === selectedCategory;
      
      return matchesCategory && matchesSearch && matchesFilter;
    });

    return {
      categoria,
      normativas: categoriaNormativas,
      colorClass: getImprovedColorClass(index),
      count: categoriaNormativas.length
    };
  }).filter(group => group.count > 0 || !selectedCategory);

  // Manejar creación de nueva normativa
  const handleCreateNormativa = async (formData: FormData): Promise<void> => {
    try {
      // URL base configurable - ajusta según tu setup
      const API_BASE_URL =  'https://leteragoback.onrender.com';
      const url = `${API_BASE_URL}/api/normativas`;
      
      console.log('Creando normativa en:', url);
      console.log('Datos a enviar:', formData);
      
      // Llamada real a la API para crear normativa
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Añadir token de autenticación
          ...(localStorage.getItem('auth_token') && {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          })
        },
        body: JSON.stringify(formData)
      });

      console.log('Create response status:', response.status);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const responseText = await response.text();
          console.error('Error response (not JSON):', responseText.substring(0, 200));
          
          if (response.status === 404) {
            errorMessage = 'La ruta /api/normativas no fue encontrada para crear normativas.';
          } else if (response.status === 401) {
            errorMessage = 'No autorizado para crear normativas. Verifica tu autenticación.';
          } else if (response.status === 422) {
            errorMessage = 'Datos de normativa inválidos. Verifica todos los campos.';
          }
        }
        
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('El servidor no devolvió JSON válido al crear la normativa.');
      }

      const data = await response.json();
      console.log('Create response data:', data);
      
      if (data.success && data.data && data.data.normativa) {
        // Procesar la nueva normativa
        const nuevaNormativa: Normativa = {
          ...data.data.normativa,
          fechaVencimiento: new Date(data.data.normativa.fechaVencimiento),
          createdAt: new Date(data.data.normativa.createdAt),
          updatedAt: new Date(data.data.normativa.updatedAt)
        };

        // Añadir a la lista local
        setNormativas(prev => [...prev, nuevaNormativa]);
        
        // Actualizar estadísticas

        const diasHasta = calculateDaysUntil(nuevaNormativa.fechaVencimiento);
        
        setStats(prev => ({
          total: prev.total + 1,
          vencidas: prev.vencidas,
          proximasAVencer: diasHasta > 0 && diasHasta <= 30 ? prev.proximasAVencer + 1 : prev.proximasAVencer
        }));
        
        console.log('Normativa creada exitosamente:', nuevaNormativa);
      } else {
        throw new Error(data.message || 'No se pudo crear la normativa');
      }
    } catch (error: any) {
      console.error('Error creating normativa:', error);
      throw error; // Re-throw para que el modal pueda manejarlo
    }
  };

  // Manejar clic en normativa para ver detalle
  const handleNormativaClick = (normativa: Normativa): void => {
    setSelectedNormativa(normativa);
  };

  // Cerrar modal de detalle
  const handleCloseDetail = (): void => {
    setSelectedNormativa(null);
  };

  // Calcular estadísticas iniciales
  useEffect(() => {
    const today = new Date();
    const vencidas = normativas.filter(n => new Date(n.fechaVencimiento) < today).length;
    const proximasAVencer = normativas.filter(n => {
      const days = calculateDaysUntil(n.fechaVencimiento);
      return days > 0 && days <= 30;
    }).length;
    
    setStats({
      total: normativas.length,
      vencidas,
      proximasAVencer
    });
  }, [normativas]);

  // Estado de loading y error para mostrar feedback al usuario
  if (loading) {
    return (
      <div className="p-6 w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Cargando normativas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadNormativas}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Matriz Normativas
            </h1>
          </div>
          
          {/* Botón para crear nueva normativa */}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Normativa</span>
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Normativas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Vigentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total - stats.vencidas - stats.proximasAVencer}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <Filter className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Próximas a Vencer</p>
                <p className="text-2xl font-bold text-gray-900">{stats.proximasAVencer}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <Filter className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Vencidas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.vencidas}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar normativas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {NORMATIVAS_CATEGORIES.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Matriz de normativas */}
      <div className="flex justify-center w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6 w-full max-w-none">
          {groupedNormativas.map((group) => (
            <div key={group.categoria} className="space-y-4 w-full">
              {/* Header de categoría */}
              <div className={`bg-gradient-to-br ${group.colorClass} rounded-xl p-4 text-center shadow-lg border border-white/20`}>
                <h3 className="font-bold text-white text-base drop-shadow-sm">{group.categoria}</h3>
                <p className="text-sm text-white/90 mt-1 font-medium">
                  {group.count} normativas
                </p>
              </div>

              {/* Normativas de la categoría */}
              <div className="space-y-4">
                {group.normativas.map((normativa) => {
                  const estado = getEstadoVencimiento(normativa.fechaVencimiento);
                  return (
                    <div
                      key={normativa._id}
                      onClick={() => handleNormativaClick(normativa)}
                      className={`bg-gradient-to-br ${group.colorClass} cursor-pointer hover:shadow-2xl transition-all duration-300 relative rounded-xl p-4 min-h-[140px] shadow-lg hover:scale-[1.02] hover:-translate-y-1 border border-white/20`}
                    >
                      {/* Indicador de estado */}
                      <div className={`absolute top-3 right-3 w-4 h-4 rounded-full shadow-md border-2 border-white ${
                        estado === 'vencida' ? 'bg-red-500' :
                        estado === 'critica' ? 'bg-orange-400' :
                        estado === 'proxima' ? 'bg-yellow-400' : 'bg-green-400'
                      }`} />
                      
                      <div className="h-full flex flex-col justify-between pr-8">
                        <h4 className="font-bold text-sm leading-tight mb-3 text-white drop-shadow-sm">
                          {normativa.nombre}
                        </h4>
                        <div className="text-xs text-white/95">
                          <p className="truncate mb-2 leading-relaxed" title={normativa.descripcion}>
                            {normativa.descripcion.substring(0, 65)}...
                          </p>
                          <div className="bg-black/10 rounded-lg p-2 backdrop-blur-sm">
                            <p className="font-semibold text-xs mb-1">
                              📅 {new Date(normativa.fechaVencimiento).toLocaleDateString('es-ES')}
                            </p>
                            <p className="text-xs opacity-90">
                              👤 {normativa.createdBy.username}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Mostrar mensaje si no hay normativas en esta categoría */}
                {group.count === 0 && (selectedCategory === group.categoria || !selectedCategory) && (
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500 bg-white/50 backdrop-blur-sm shadow-sm">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="text-sm font-medium">No hay normativas en esta categoría</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mensaje cuando no hay resultados */}
      {groupedNormativas.every(group => group.count === 0) && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron normativas
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory
              ? 'Intenta ajustar tus filtros de búsqueda'
              : 'No hay normativas disponibles'}
          </p>
          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Modales */}
      {/* Modal del formulario */}
      <NormativaFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateNormativa}
      />

      {/* Modal de detalle */}
      {selectedNormativa && (
        <NormativaDetail
          normativa={selectedNormativa}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default NormativasMatrix;