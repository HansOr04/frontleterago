import React from 'react';
import { X, FileText, MapPin, User, Calendar, AlertTriangle, Clock } from 'lucide-react';
import { Normativa } from '../../types/normativas.types';

interface NormativaDetailProps {
  normativa: Normativa;
  onClose: () => void;
}

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
    if (days < 0) return { status: 'vencida', color: 'red', icon: AlertTriangle };
    if (days <= 7) return { status: 'crítica', color: 'orange', icon: AlertTriangle };
    if (days <= 30) return { status: 'próxima a vencer', color: 'yellow', icon: Clock };
    return { status: 'vigente', color: 'green', icon: FileText };
  };

  const expirationInfo = getExpirationStatus();
  const StatusIcon = expirationInfo.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-leterago-primary" />
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
              <div className={`bg-${expirationInfo.color}-50 border border-${expirationInfo.color}-200 rounded-lg p-4`}>
                <div className="flex items-center space-x-2 mb-2">
                  <StatusIcon className={`w-4 h-4 text-${expirationInfo.color}-600`} />
                  <span className={`text-sm font-medium text-${expirationInfo.color}-800`}>
                    Estado
                  </span>
                </div>
                <p className={`text-${expirationInfo.color}-700 capitalize`}>
                  {expirationInfo.status}
                </p>
                <p className={`text-xs text-${expirationInfo.color}-600 mt-1`}>
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
            <div className={`bg-${expirationInfo.color}-50 border border-${expirationInfo.color}-200 rounded-lg p-4`}>
              <p className={`text-${expirationInfo.color}-800 font-medium`}>
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
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
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

export default NormativaDetail;