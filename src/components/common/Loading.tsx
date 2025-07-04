import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Cargando...', 
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className={`${sizeClasses[size]} text-leterago-primary animate-spin`} />
          <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
            {text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <Loader2 className={`${sizeClasses[size]} text-leterago-primary animate-spin`} />
        <p className={`${textSizeClasses[size]} text-gray-600`}>
          {text}
        </p>
      </div>
    </div>
  );
};

// Componente específico para loading inline
export const InlineLoading: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
  
  return (
    <Loader2 className={`${sizeClass} text-leterago-primary animate-spin inline-block`} />
  );
};

// Componente para loading de botones
export const ButtonLoading: React.FC<{ text?: string }> = ({ text = 'Cargando...' }) => {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>{text}</span>
    </div>
  );
};

export default Loading;