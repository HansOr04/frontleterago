import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import ErrorBoundary from './ErrorBoundary';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Contenido principal */}
      <main className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      
      {/* Footer opcional */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            © 2024 Leterago - Sistema de Gestión de Normativas SOA
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;