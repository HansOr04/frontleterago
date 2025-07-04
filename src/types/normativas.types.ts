import { CreatedBy, BaseFilters } from './api.types'

// Normativa base
export interface Normativa {
  _id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  ubicacion: string;
  fechaVencimiento: Date;
  createdBy: CreatedBy;
  createdAt?: Date;
  updatedAt?: Date;
}

// Filtros específicos para normativas
export interface NormativaFilters extends BaseFilters {
  categoria?: string;
  fechaVencimientoDesde?: string;
  fechaVencimientoHasta?: string;
  vencidas?: boolean;
  proximasAVencer?: number;
  createdBy?: string;
}

// Estadísticas de normativas
export interface NormativaStats {
  total: number;
  porCategoria: {
    categoria: string;
    cantidad: number;
  }[];
  vencidas: number;
  proximasAVencer: {
    en7Dias: number;
    en15Dias: number;
    en30Dias: number;
  };
  creadasEsteAno: number;
  actualizadasEsteAno: number;
}

// Datos para crear normativa
export interface CreateNormativaData {
  nombre: string;
  categoria: string;
  descripcion: string;
  ubicacion: string;
  fechaVencimiento: string;
}

// Datos para actualizar normativa
export interface UpdateNormativaData {
  nombre?: string;
  categoria?: string;
  descripcion?: string;
  ubicacion?: string;
  fechaVencimiento?: string;
}

// Categorías de normativas (coincide con el backend)
export type NormativaCategoria = 
  | 'Organización y Contexto'
  | 'Liderazgo'
  | 'Planificación'
  | 'Soporte'
  | 'Operación'
  | 'Evaluación del Desempeño'
  | 'Mejora';

// Estado de la normativa
export type EstadoNormativa = 'vigente' | 'proxima' | 'critica' | 'vencida';

// Normativa con estado calculado
export interface NormativaWithStatus extends Normativa {
  estado: EstadoNormativa;
  diasHastaVencimiento: number;
}

// Agrupación de normativas por categoría
export interface NormativasGrouped {
  categoria: string;
  normativas: Normativa[];
  count: number;
}

// Respuesta de la matriz de normativas
export interface MatrizNormativas {
  grupos: NormativasGrouped[];
  stats: NormativaStats;
}

// Reporte de vencimientos
export interface ReporteVencimientos {
  vencidas: {
    count: number;
    normativas: Normativa[];
  };
  proximasAVencer: {
    en7Dias: {
      count: number;
      normativas: Normativa[];
    };
    en15Dias: {
      count: number;
      normativas: Normativa[];
    };
    en30Dias: {
      count: number;
      normativas: Normativa[];
    };
  };
  resumen: {
    totalVencidas: number;
    totalProximasAVencer: number;
    criticidad: {
      alta: number;
      media: number;
      baja: number;
    };
  };
}