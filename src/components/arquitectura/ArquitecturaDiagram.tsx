import React from 'react';
import { Network, Shield, Zap, Eye, Server, Lock } from 'lucide-react';

const ArquitecturaDiagram: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Network className="w-8 h-8 text-leterago-primary" />
          <h1 className="text-3xl font-bold text-gray-900">
            Arquitectura .....
          </h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Security Operations Center
        </h2>
      </div>

      {/* Diagrama SOC */}
      <div className="soc-diagram">
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Componentes superiores */}
          <div className="flex justify-between items-center mb-12">
            {/* CHECKPOINT */}
            <div className="soc-node soc-checkpoint">
              <Shield className="w-6 h-6 mb-2 mx-auto" />
              <div className="text-lg font-bold">CHECKPOINT</div>
            </div>

            {/* Threat Intelligence */}
            <div className="soc-node soc-threat">
              <Eye className="w-6 h-6 mb-2 mx-auto" />
              <div className="text-sm font-bold text-center">
                Threat Intelligence<br />
                y Hunting de<br />
                Amenazas
              </div>
            </div>
          </div>

          {/* Conexiones superiores al centro */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="soc-connection"></div>
              <div className="soc-connection transform rotate-90"></div>
            </div>
          </div>

          {/* Fila central */}
          <div className="flex justify-between items-center mb-12">
            {/* TRELLIX */}
            <div className="soc-node soc-trellix">
              <Server className="w-6 h-6 mb-2 mx-auto" />
              <div className="text-lg font-bold">TRELLIX</div>
            </div>

            {/* Conexión izquierda */}
            <div className="soc-connection"></div>

            {/* SOC Central */}
            <div className="soc-node soc-center">
              <Shield className="w-8 h-8 mb-2 mx-auto" />
              <div className="text-3xl font-bold">SOC</div>
            </div>

            {/* Conexión derecha */}
            <div className="soc-connection"></div>

            {/* Azure Sentinel */}
            <div className="soc-node soc-azure">
              <Zap className="w-6 h-6 mb-2 mx-auto" />
              <div className="text-lg font-bold">Azure Sentinel</div>
            </div>
          </div>

          {/* Conexiones inferiores del centro */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="soc-connection transform rotate-90"></div>
              <div className="soc-connection"></div>
            </div>
          </div>

          {/* Componente inferior */}
          <div className="flex justify-center">
            <div className="soc-node soc-checkpoint">
              <Lock className="w-6 h-6 mb-2 mx-auto" />
              <div className="text-base font-bold text-center">
                CHECKPOINT<br />
                INFINITY PORTAL
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Componentes */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-leterago-primary" />
            Componentes de Seguridad
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• CHECKPOINT - Firewall y Gateway</li>
            <li>• TRELLIX - Endpoint Protection</li>
            <li>• Azure Sentinel - SIEM/SOAR</li>
            <li>• Threat Intelligence - Análisis de amenazas</li>
            <li>• INFINITY PORTAL - Gestión centralizada</li>
          </ul>
        </div>

        {/* Funcionalidades */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-leterago-primary" />
            Capacidades del SOC
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Monitoreo 24/7</li>
            <li>• Detección de amenazas</li>
            <li>• Respuesta a incidentes</li>
            <li>• Análisis forense</li>
            <li>• Hunting de amenazas</li>
          </ul>
        </div>

        {/* Beneficios */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-leterago-primary" />
            Beneficios
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Visibilidad completa</li>
            <li>• Respuesta rápida</li>
            <li>• Prevención proactiva</li>
            <li>• Cumplimiento normativo</li>
            <li>• Reducción de riesgos</li>
          </ul>
        </div>
      </div>

      {/* Descripción técnica */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Arquitectura del Security Operations Center
        </h3>
        <p className="text-gray-700 leading-relaxed">
          El SOC de Leterago integra múltiples tecnologías de seguridad para proporcionar 
          una protección integral contra amenazas cibernéticas. La arquitectura centralizada 
          permite la correlación de eventos de seguridad, análisis de amenazas en tiempo real 
          y respuesta automatizada a incidentes, garantizando la continuidad operacional y 
          el cumplimiento de las normativas de seguridad farmacéutica.
        </p>
      </div>
    </div>
  );
};

export default ArquitecturaDiagram;