import React, { useState, useEffect } from 'react';
import { Shield, Search, Filter, BarChart3, Plus, X, MapPin, Save, AlertCircle, FileText, User, Calendar } from 'lucide-react';

// Tipos e interfaces para Anexos SOA
interface CreatedBy {
  _id: string;
  username: string;
  email: string;
}

interface AnexoSOA {
  _id: string;
  nombreControl: string;
  categoria: string;
  descripcion: string;
  ubicacion: string;
  observaciones?: string;
  createdBy: CreatedBy;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FormData {
  nombreControl: string;
  categoria: string;
  descripcion: string;
  ubicacion: string;
  observaciones?: string;
}

interface FormErrors {
  [key: string]: string;
}

interface Stats {
  total: number;
  totalCategorias: number;
  porCategoria: { categoria: string; cantidad: number }[];
}

interface GroupedAnexos {
  categoria: string;
  controles: AnexoSOA[];
  colorClass: string;
  count: number;
}

interface AnexoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

interface AnexoDetailProps {
  anexo: AnexoSOA;
  onClose: () => void;
}

// Constantes - Categorías simplificadas de anexos SOA
const ANEXOS_SOA_CATEGORIES = [
  'Controles Organizacionales',
  'Controles de Personas',
  'Controles Físicos',
  'Controles Tecnológicos'
] as const;

// Componente AnexoDetail
const AnexoDetail: React.FC<AnexoDetailProps> = ({ anexo, onClose }) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Detalle del Control SOA
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
              {anexo.nombreControl}
            </h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Categoría</span>
              </div>
              <p className="text-blue-700">{anexo.categoria}</p>
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
                {anexo.descripcion}
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
              <p className="text-gray-700">{anexo.ubicacion}</p>
            </div>
          </div>

          {/* Observaciones */}
          {anexo.observaciones && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <h4 className="text-md font-medium text-gray-900">Observaciones</h4>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 whitespace-pre-wrap">
                  {anexo.observaciones}
                </p>
              </div>
            </div>
          )}

          {/* Información de creación */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Información del Control
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Creado por */}
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Creado por</p>
                  <p className="text-sm text-gray-600">{anexo.createdBy.username}</p>
                  <p className="text-xs text-gray-500">{anexo.createdBy.email}</p>
                </div>
              </div>

              {/* Fecha de creación */}
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Fecha de creación</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(anexo.createdAt)}
                  </p>
                  {anexo.updatedAt && anexo.updatedAt !== anexo.createdAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Actualizado: {formatDate(anexo.updatedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ID del control (para referencia) */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">
              <span className="font-medium">ID del Control:</span> {anexo._id}
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
const AnexoFormModal: React.FC<AnexoFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    nombreControl: '',
    categoria: '',
    descripcion: '',
    ubicacion: '',
    observaciones: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Resetear formulario cuando se abre
  useEffect(() => {
    if (isOpen) {
      setFormData({
        nombreControl: '',
        categoria: '',
        descripcion: '',
        ubicacion: '',
        observaciones: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombreControl.trim()) {
      newErrors.nombreControl = 'El nombre del control es requerido';
    } else if (formData.nombreControl.length < 3) {
      newErrors.nombreControl = 'El nombre debe tener al menos 3 caracteres';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      console.error('Error al crear anexo SOA:', error);
      alert(error.message || 'Error al crear el control SOA. Por favor, intenta nuevamente.');
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
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Nuevo Control SOA</h2>
              <p className="text-sm text-gray-600">Completa la información para crear un nuevo control</p>
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
          {/* Nombre del Control */}
          <div>
            <label htmlFor="nombreControl" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Control *
            </label>
            <input
              type="text"
              id="nombreControl"
              name="nombreControl"
              value={formData.nombreControl}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.nombreControl ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ej: Control de Acceso a Sistemas Críticos"
              disabled={isSubmitting}
            />
            {errors.nombreControl && (
              <div className="flex items-center mt-2 text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.nombreControl}</span>
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
              {ANEXOS_SOA_CATEGORIES.map((categoria) => (
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
              placeholder="Describe el control de seguridad y su implementación..."
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
                placeholder="Ej: /documentos/soa/controles/control-acceso.pdf"
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

          {/* Observaciones */}
          <div>
            <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Observaciones adicionales sobre la implementación del control..."
              disabled={isSubmitting}
            />
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
                  <span>Crear Control</span>
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
const AnexosMatrix: React.FC = () => {
  const [anexos, setAnexos] = useState<AnexoSOA[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedAnexo, setSelectedAnexo] = useState<AnexoSOA | null>(null);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    totalCategorias: 0,
    porCategoria: []
  });

  // Función para cargar anexos desde la API
  const loadAnexos = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const API_BASE_URL = import.meta.env?.VITE_API_URL || 
                          (window as any).env?.REACT_APP_API_URL || 
                          'http://localhost:5000';
      const url = `${API_BASE_URL}/api/anexos`;
      
      console.log('Cargando anexos desde:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('auth_token') && {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          })
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Error response:', responseText);
        
        if (response.status === 404) {
          throw new Error('La ruta /api/anexos no fue encontrada. Verifica que el servidor esté ejecutándose correctamente.');
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
        let anexosData: AnexoSOA[] = [];
        
        if (Array.isArray(data.data)) {
          anexosData = data.data;
        } else if (data.data.anexos && Array.isArray(data.data.anexos)) {
          anexosData = data.data.anexos;
        } else if (data.data.data && Array.isArray(data.data.data)) {
          anexosData = data.data.data;
        } else {
          console.error('Estructura de respuesta inesperada:', data);
          throw new Error('Formato de respuesta inesperado del servidor');
        }

        // Filtrar solo las categorías que queremos mostrar
        const filteredAnexos = anexosData.filter(anexo => 
          ANEXOS_SOA_CATEGORIES.includes(anexo.categoria as any)
        );

        // Procesar fechas
        const processedAnexos = filteredAnexos.map((anexo: any) => ({
          ...anexo,
          createdAt: anexo.createdAt ? new Date(anexo.createdAt) : undefined,
          updatedAt: anexo.updatedAt ? new Date(anexo.updatedAt) : undefined
        }));

        setAnexos(processedAnexos);
        console.log(`Cargados ${processedAnexos.length} anexos exitosamente (filtrados de ${anexosData.length} total)`);
        
      } else {
        throw new Error(data.message || 'No se recibieron datos válidos del servidor');
      }
    } catch (err: any) {
      console.error('Error loading anexos:', err);
      
      let userMessage = 'Error al cargar los anexos SOA';
      
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

  // Cargar anexos al montar el componente
  useEffect(() => {
    loadAnexos();
  }, []);

  // Función para obtener color por categoría
  const getColorClass = (index: number): string => {
    const colors = [
      'from-blue-600 to-blue-700',      // Controles Organizacionales
      'from-green-600 to-green-700',    // Controles de Personas
      'from-orange-600 to-orange-700',  // Controles Físicos
      'from-purple-600 to-purple-700',  // Controles Tecnológicos
    ];
    return colors[index % colors.length];
  };

  // Agrupar anexos por categoría
  const groupedAnexos: GroupedAnexos[] = ANEXOS_SOA_CATEGORIES.map((categoria, index) => {
    const categoriaAnexos = anexos.filter(anexo => {
      const matchesCategory = anexo.categoria === categoria;
      const matchesSearch = !searchTerm || 
        anexo.nombreControl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anexo.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = !selectedCategory || categoria === selectedCategory;
      
      return matchesCategory && matchesSearch && matchesFilter;
    });

    return {
      categoria,
      controles: categoriaAnexos,
      colorClass: getColorClass(index),
      count: categoriaAnexos.length
    };
  }).filter(group => group.count > 0 || !selectedCategory);

  // Manejar creación de nuevo anexo
  const handleCreateAnexo = async (formData: FormData): Promise<void> => {
    try {
      const API_BASE_URL = import.meta.env?.VITE_API_URL || 
                          (window as any).env?.REACT_APP_API_URL || 
                          'http://localhost:5000';
      const url = `${API_BASE_URL}/api/anexos`;
      
      console.log('Creando anexo en:', url);
      console.log('Datos a enviar:', formData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
            errorMessage = 'La ruta /api/anexos no fue encontrada para crear controles SOA.';
          } else if (response.status === 401) {
            errorMessage = 'No autorizado para crear controles SOA. Verifica tu autenticación.';
          } else if (response.status === 422) {
            errorMessage = 'Datos de control SOA inválidos. Verifica todos los campos.';
          }
        }
        
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('El servidor no devolvió JSON válido al crear el control SOA.');
      }

      const data = await response.json();
      console.log('Create response data:', data);
      
      if (data.success && data.data && data.data.anexo) {
        const nuevoAnexo: AnexoSOA = {
          ...data.data.anexo,
          createdAt: new Date(data.data.anexo.createdAt),
          updatedAt: new Date(data.data.anexo.updatedAt)
        };

        // Solo agregar si está en nuestras categorías permitidas
        if (ANEXOS_SOA_CATEGORIES.includes(nuevoAnexo.categoria as any)) {
          setAnexos(prev => [...prev, nuevoAnexo]);
          
          setStats(prev => ({
            total: prev.total + 1,
            totalCategorias: prev.totalCategorias,
            porCategoria: prev.porCategoria.map(cat => 
              cat.categoria === nuevoAnexo.categoria 
                ? { ...cat, cantidad: cat.cantidad + 1 }
                : cat
            )
          }));
        }
        
        console.log('Anexo SOA creado exitosamente:', nuevoAnexo);
      } else {
        throw new Error(data.message || 'No se pudo crear el control SOA');
      }
    } catch (error: any) {
      console.error('Error creating anexo:', error);
      throw error; // Re-throw para que el modal pueda manejarlo
    }
  };

  // Manejar clic en anexo para ver detalle
  const handleAnexoClick = (anexo: AnexoSOA): void => {
    setSelectedAnexo(anexo);
  };

  // Cerrar modal de detalle
  const handleCloseDetail = (): void => {
    setSelectedAnexo(null);
  };

  // Calcular estadísticas
  useEffect(() => {
    const categorias = ANEXOS_SOA_CATEGORIES.map(categoria => ({
      categoria,
      cantidad: anexos.filter(anexo => anexo.categoria === categoria).length
    }));
    
    setStats({
      total: anexos.length,
      totalCategorias: categorias.filter(cat => cat.cantidad > 0).length,
      porCategoria: categorias
    });
  }, [anexos]);

  // Estado de loading y error
  if (loading) {
    return (
      <div className="p-6 w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Cargando anexos SOA...</p>
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
            onClick={loadAnexos}
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
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Matriz Anexos SOA
            </h1>
          </div>
          
          {/* Botón para crear nuevo anexo */}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Control SOA</span>
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Controles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Categorías con Controles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCategorias}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <Filter className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Controles Visibles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {groupedAnexos.reduce((sum, cat) => sum + cat.controles.length, 0)}
                </p>
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
                placeholder="Buscar controles SOA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-80">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {ANEXOS_SOA_CATEGORIES.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Matriz de controles SOA */}
      <div className="flex justify-center w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-none">
          {groupedAnexos.map((group) => (
            <div key={group.categoria} className="space-y-4 w-full">
              {/* Header de categoría */}
              <div className={`bg-gradient-to-br ${group.colorClass} rounded-xl p-4 text-center shadow-lg border border-white/20`}>
                <h3 className="font-bold text-white text-sm leading-tight drop-shadow-sm mb-1">
                  {group.categoria}
                </h3>
                <p className="text-xs text-white/90 font-medium">
                  {group.count} controles
                </p>
              </div>

              {/* Controles de la categoría */}
              <div className="space-y-4">
                {group.controles.map((control) => (
                  <div
                    key={control._id}
                    onClick={() => handleAnexoClick(control)}
                    className={`bg-gradient-to-br ${group.colorClass} cursor-pointer hover:shadow-2xl transition-all duration-300 relative rounded-xl p-4 min-h-[140px] shadow-lg hover:scale-[1.02] hover:-translate-y-1 border border-white/20`}
                  >
                    <div className="h-full flex flex-col justify-between">
                      <h4 className="font-bold text-sm leading-tight mb-3 text-white drop-shadow-sm">
                        {control.nombreControl}
                      </h4>
                      <div className="text-xs text-white/95">
                        <p className="truncate mb-2 leading-relaxed" title={control.descripcion}>
                          {control.descripcion.substring(0, 65)}...
                        </p>
                        <div className="bg-black/10 rounded-lg p-2 backdrop-blur-sm">
                          <p className="font-semibold text-xs mb-1">
                            📍 {control.ubicacion.substring(0, 30)}...
                          </p>
                          <p className="text-xs opacity-90">
                            👤 {control.createdBy.username}
                          </p>
                          {control.observaciones && (
                            <p className="text-xs opacity-80 mt-1">
                              📝 Tiene observaciones
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Mostrar mensaje si no hay controles en esta categoría */}
                {group.count === 0 && (selectedCategory === group.categoria || !selectedCategory) && (
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500 bg-white/50 backdrop-blur-sm shadow-sm">
                    <Shield className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="text-sm font-medium">No hay controles en esta categoría</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mensaje cuando no hay resultados */}
      {groupedAnexos.every(group => group.count === 0) && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron controles SOA
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory
              ? 'Intenta ajustar tus filtros de búsqueda'
              : 'No hay controles SOA disponibles'}
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
      <AnexoFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateAnexo}
      />

      {/* Modal de detalle */}
      {selectedAnexo && (
        <AnexoDetail
          anexo={selectedAnexo}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default AnexosMatrix;