import React, { useState, useEffect } from 'react';
import { Shield, Search, Filter, BarChart3 } from 'lucide-react';
import anexosService from '../../services/anexos.service';
import { ControlMatrix, AnexoSOA } from '../../types/anexos.types';
import Loading from '../common/Loading';
import { ErrorMessage } from '../common/ErrorBoundary';
import { ANEXO_CATEGORY_COLORS } from '../../utils/constants';
import AnexoDetail from './AnexoDetail';

const AnexosMatrix: React.FC = () => {
  const [matrix, setMatrix] = useState<ControlMatrix[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnexo, setSelectedAnexo] = useState<AnexoSOA | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [stats, setStats] = useState({
    totalControles: 0,
    totalCategorias: 0
  });

  // Cargar matriz de controles
  const loadMatrix = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await anexosService.getControlMatrix();
      
      if (response.success && response.data) {
        setMatrix(response.data.matrix);
        setStats({
          totalControles: response.data.totalControles,
          totalCategorias: response.data.totalCategorias
        });
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar la matriz de anexos SOA');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatrix();
  }, []);

  // Filtrar controles basado en búsqueda y categoría
  const filteredMatrix = matrix.map(categoria => ({
    ...categoria,
    controles: categoria.controles.filter(control => {
      const matchesSearch = !searchTerm || 
        control.nombreControl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        control.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || categoria.categoria === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
  })).filter(categoria => categoria.controles.length > 0);

  // Obtener color de la categoría
  const getCategoryColor = (index: number) => {
    return ANEXO_CATEGORY_COLORS[index % ANEXO_CATEGORY_COLORS.length];
  };

  // Manejar clic en control
  const handleControlClick = (anexo: AnexoSOA) => {
    setSelectedAnexo(anexo);
  };

  // Cerrar detalle
  const handleCloseDetail = () => {
    setSelectedAnexo(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loading text="Cargando matriz de anexos SOA..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={loadMatrix} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-8 h-8 text-leterago-primary" />
          <h1 className="text-3xl font-bold text-gray-900">
            Matriz Anexos (SoA)
          </h1>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Controles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalControles}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Categorías</p>
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
                  {filteredMatrix.reduce((sum, cat) => sum + cat.controles.length, 0)}
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
                placeholder="Buscar controles..."
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
              {matrix.map((categoria) => (
                <option key={categoria.categoria} value={categoria.categoria}>
                  {categoria.categoria}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Matriz de controles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMatrix.map((categoria, categoryIndex) => (
          <div key={categoria.categoria} className="space-y-2">
            {/* Header de categoría */}
            <div className={`matrix-header ${getCategoryColor(categoryIndex)}`}>
              <h3 className="font-bold text-center">{categoria.categoria}</h3>
              <p className="text-xs text-center opacity-90 mt-1">
                {categoria.controles.length} controles
              </p>
            </div>

            {/* Controles de la categoría */}
            <div className="space-y-2">
              {categoria.controles.map((control) => (
                <div
                  key={control._id}
                  onClick={() => handleControlClick(control)}
                  className={`matrix-cell ${getCategoryColor(categoryIndex)} cursor-pointer hover:shadow-lg transition-all duration-200`}
                  style={{ minHeight: '120px' }}
                >
                  <div className="h-full flex flex-col justify-between">
                    <h4 className="font-medium text-sm leading-tight mb-2">
                      {control.nombreControl}
                    </h4>
                    <div className="text-xs opacity-90">
                      <p className="truncate" title={control.descripcion}>
                        {control.descripcion.substring(0, 60)}...
                      </p>
                      <p className="mt-1 font-medium">
                        {control.createdBy.username}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay resultados */}
      {filteredMatrix.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron controles
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
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-leterago-primary bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

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