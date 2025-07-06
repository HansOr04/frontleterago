import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, BarChart3 } from 'lucide-react';
import normativasService from '../../services/normativas.service';
import type { Normativa } from '../../types/normativas.types';
import Loading from '../common/Loading';
import { ErrorMessage } from '../common/ErrorBoundary';
import { NORMATIVA_CATEGORY_COLORS, NORMATIVAS_CATEGORIES } from '../../utils/constants';
import { calculateDaysUntil } from '../../utils/helpers';
import NormativaDetail from './NormativaDetail';

const NormativasMatrix: React.FC = () => {
  const [normativas, setNormativas] = useState<Normativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNormativa, setSelectedNormativa] = useState<Normativa | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [stats, setStats] = useState({
    total: 0,
    vencidas: 0,
    proximasAVencer: 0
  });

  // Mejorar los colores con mejor contraste
  const getImprovedColorClass = (index: number) => {
    const improvedColors = [
      'from-blue-600 to-blue-700',      // Organización y Contexto
      'from-indigo-600 to-indigo-700',  // Liderazgo
      'from-purple-600 to-purple-700',  // Planificación
      'from-cyan-600 to-cyan-700',      // Soporte
      'from-teal-600 to-teal-700',      // Operación
      'from-emerald-600 to-emerald-700', // Evaluación del Desempeño
      'from-blue-700 to-blue-800',      // Mejora (más oscuro)
    ];
    return improvedColors[index % improvedColors.length];
  };

  // Cargar normativas
  const loadNormativas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await normativasService.getAllNormativas();
      
      if (response.success && response.data) {
        // Fix: Handle different response structures
        let normativasData: Normativa[] = [];
        const data = response.data as any; // Type assertion to handle unknown structure
        
        if (Array.isArray(data)) {
          // If data is directly an array
          normativasData = data as Normativa[];
        } else if (data.normativas && Array.isArray(data.normativas)) {
          // If data has a normativas property that is an array
          normativasData = data.normativas as Normativa[];
        } else if (data.data && Array.isArray(data.data)) {
          // If data has a data property that is an array
          normativasData = data.data as Normativa[];
        } else {
          console.error('Unexpected response structure:', data);
          throw new Error('Formato de respuesta inesperado del servidor');
        }
        
        setNormativas(normativasData);
        
        // Calcular estadísticas básicas
        const today = new Date();
        const vencidas = normativasData.filter(n => new Date(n.fechaVencimiento) < today).length;
        const proximasAVencer = normativasData.filter(n => {
          const days = calculateDaysUntil(n.fechaVencimiento);
          return days > 0 && days <= 30;
        }).length;
        
        setStats({
          total: normativasData.length,
          vencidas,
          proximasAVencer
        });
      } else {
        throw new Error('No se recibieron datos válidos del servidor');
      }
    } catch (err: any) {
      console.error('Error loading normativas:', err);
      setError(err.message || 'Error al cargar las normativas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNormativas();
  }, []);

  // Agrupar normativas por categoría
  const groupedNormativas = NORMATIVAS_CATEGORIES.map((categoria, index) => {
    // Add safety check to ensure normativas is an array
    const normativasArray = Array.isArray(normativas) ? normativas : [];
    
    const categoriaNormativas = normativasArray.filter(normativa => {
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
      colorClass: getImprovedColorClass(index), // Usar los colores mejorados
      count: categoriaNormativas.length
    };
  }).filter(group => group.count > 0 || !selectedCategory);

  // Manejar clic en normativa
  const handleNormativaClick = (normativa: Normativa) => {
    setSelectedNormativa(normativa);
  };

  // Cerrar detalle
  const handleCloseDetail = () => {
    setSelectedNormativa(null);
  };

  // Calcular estado de vencimiento
  const getEstadoVencimiento = (fechaVencimiento: Date) => {
    const diasHasta = calculateDaysUntil(fechaVencimiento);
    
    if (diasHasta < 0) return 'vencida';
    if (diasHasta <= 7) return 'critica';
    if (diasHasta <= 30) return 'proxima';
    return 'vigente';
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loading text="Cargando matriz de normativas..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={loadNormativas} />
      </div>
    );
  }

  return (
    <div className="p-6 w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-8 h-8 text-leterago-primary" />
          <h1 className="text-3xl font-bold text-gray-900">
            Matriz Normativas
          </h1>
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leterago-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leterago-primary focus:border-transparent"
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
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-leterago-primary bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

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