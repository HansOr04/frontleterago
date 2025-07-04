import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, BarChart3 } from 'lucide-react';
import normativasService from '../../services/normativas.service';
import type { Normativa } from '../../types/normativas.types';
import Loading from '../common/Loading';
import { ErrorMessage } from '../common/ErrorBoundary';
import { NORMATIVA_CATEGORY_COLORS, NORMATIVAS_CATEGORIES } from '../../utils/constants';
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

  // Cargar normativas
  const loadNormativas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await normativasService.getAllNormativas();
      
      if (response.success && response.data) {
        setNormativas(response.data);
        
        // Calcular estadísticas básicas
        const today = new Date();
        const vencidas = response.data.filter(n => new Date(n.fechaVencimiento) < today).length;
        const proximasAVencer = response.data.filter(n => {
          const days = Math.ceil((new Date(n.fechaVencimiento).getTime() - today.getTime()) / (1000 * 3600 * 24));
          return days > 0 && days <= 30;
        }).length;
        
        setStats({
          total: response.data.length,
          vencidas,
          proximasAVencer
        });
      }
    } catch (err: any) {
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
      colorClass: NORMATIVA_CATEGORY_COLORS[index % NORMATIVA_CATEGORY_COLORS.length],
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
    const today = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diasHasta = Math.ceil((vencimiento.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
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
    <div className="p-6 max-w-7xl mx-auto">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groupedNormativas.map((group) => (
          <div key={group.categoria} className="space-y-2">
            {/* Header de categoría */}
            <div className={`matrix-header ${group.colorClass}`}>
              <h3 className="font-bold text-center text-white">{group.categoria}</h3>
              <p className="text-xs text-center opacity-90 mt-1 text-white">
                {group.count} normativas
              </p>
            </div>

            {/* Normativas de la categoría */}
            <div className="space-y-2">
              {group.normativas.map((normativa) => {
                const estado = getEstadoVencimiento(normativa.fechaVencimiento);
                return (
                  <div
                    key={normativa._id}
                    onClick={() => handleNormativaClick(normativa)}
                    className={`matrix-cell ${group.colorClass} cursor-pointer hover:shadow-lg transition-all duration-200 relative`}
                    style={{ minHeight: '100px' }}
                  >
                    {/* Indicador de estado */}
                    <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                      estado === 'vencida' ? 'bg-red-500' :
                      estado === 'critica' ? 'bg-orange-500' :
                      estado === 'proxima' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    
                    <div className="h-full flex flex-col justify-between pr-6">
                      <h4 className="font-medium text-sm leading-tight mb-2 text-white">
                        {normativa.nombre}
                      </h4>
                      <div className="text-xs opacity-90 text-white">
                        <p className="truncate" title={normativa.descripcion}>
                          {normativa.descripcion.substring(0, 50)}...
                        </p>
                        <p className="mt-1 font-medium">
                          Vence: {new Date(normativa.fechaVencimiento).toLocaleDateString('es-ES')}
                        </p>
                        <p className="text-xs opacity-75">
                          {normativa.createdBy.username}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Mostrar mensaje si no hay normativas en esta categoría */}
              {group.count === 0 && (selectedCategory === group.categoria || !selectedCategory) && (
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay normativas en esta categoría</p>
                </div>
              )}
            </div>
          </div>
        ))}
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