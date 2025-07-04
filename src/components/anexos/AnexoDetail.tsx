import React from 'react';
import { X, Shield, MapPin, User, Calendar, FileText } from 'lucide-react';
import { AnexoSOA } from '../../types/anexos.types';

interface AnexoDetailProps {
  anexo: AnexoSOA;
  onClose: () => void;
}

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
            <Shield className="w-6 h-6 text-leterago-primary" />
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
                <span className="text-sm font-medium text-blue-800">
                  Categoría
                </span>
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

export default AnexoDetail;