import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b-2 border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="flex items-center">
              <div className="text-2xl font-bold text-leterago-primary italic">
                Leterago
              </div>
              <div className="ml-2 text-xs text-gray-500">
                <div>Un aliado estratégico en</div>
                <div>distribución farmacéutica</div>
              </div>
            </Link>
          </div>

          {/* Navegación principal */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to={ROUTES.NORMAS}
              className={`header-nav-button ${
                isActive(ROUTES.NORMAS) ? 'active' : ''
              }`}
            >
              Normas
            </Link>
            <Link
              to={ROUTES.ARQUITECTURA}
              className={`header-nav-button ${
                isActive(ROUTES.ARQUITECTURA) ? 'active' : ''
              }`}
            >
              Arquitectura
            </Link>
            <Link
              to={ROUTES.ANEXOS}
              className={`header-nav-button ${
                isActive(ROUTES.ANEXOS) ? 'active' : ''
              }`}
            >
              Anexos
            </Link>
          </nav>

          {/* Usuario y logout */}
          <div className="flex items-center space-x-4">
            {/* Información del usuario */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-700">
              <User className="w-4 h-4" />
              <span>{user?.username}</span>
              {isAdmin && (
                <span className="bg-leterago-primary text-white px-2 py-1 rounded-full text-xs">
                  Admin
                </span>
              )}
            </div>

            {/* Botón de logout */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-leterago-primary transition-colors duration-200"
              title="Cerrar sesión"
            >
              <span className="hidden sm:inline">Login</span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navegación móvil */}
        <div className="md:hidden pb-3">
          <nav className="flex space-x-4">
            <Link
              to={ROUTES.NORMAS}
              className={`text-sm px-3 py-2 rounded-md ${
                isActive(ROUTES.NORMAS)
                  ? 'bg-leterago-primary text-white'
                  : 'text-gray-700 hover:text-leterago-primary'
              }`}
            >
              Normas
            </Link>
            <Link
              to={ROUTES.ARQUITECTURA}
              className={`text-sm px-3 py-2 rounded-md ${
                isActive(ROUTES.ARQUITECTURA)
                  ? 'bg-leterago-primary text-white'
                  : 'text-gray-700 hover:text-leterago-primary'
              }`}
            >
              Arquitectura
            </Link>
            <Link
              to={ROUTES.ANEXOS}
              className={`text-sm px-3 py-2 rounded-md ${
                isActive(ROUTES.ANEXOS)
                  ? 'bg-leterago-primary text-white'
                  : 'text-gray-700 hover:text-leterago-primary'
              }`}
            >
              Anexos
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;