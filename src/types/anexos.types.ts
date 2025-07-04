import { CreatedBy, BaseFilters } from './api.types'

// Anexo SOA base
export interface AnexoSOA {
  _id: string;
  nombreControl: string;
  categoria: string;
  descripcion: string;
  ubicacion: string;
  observaciones?: string;
  createdBy: CreatedBy;
  createdAt?: Date;
  updatedAt?: Date;
}

// Filtros específicos para anexos SOA
export interface AnexoSOAFilters extends BaseFilters {
  categoria?: string;
  dateFrom?: string;
  dateTo?: string;
  createdBy?: string;
}

// Estadísticas de anexos SOA
export interface AnexoSOAStats {
  total: number;
  porCategoria: {
    categoria: string;
    cantidad: number;
    porcentaje: number;
  }[];
  creadasEsteAno: number;
  actualizadasEsteAno: number;
  controlesPorUsuario: {
    usuario: string;
    cantidad: number;
  }[];
}

// Datos para crear anexo SOA
export interface CreateAnexoSOAData {
  nombreControl: string;
  categoria: string;
  descripcion: string;
  ubicacion: string;
  observaciones?: string;
}

// Datos para actualizar anexo SOA
export interface UpdateAnexoSOAData {
  nombreControl?: string;
  categoria?: string;
  descripcion?: string;
  ubicacion?: string;
  observaciones?: string;
}

// Categorías de anexos SOA (coincide con el backend)
export type AnexoSOACategoria = 
  | 'Controles Organizacionales'
  | 'Controles de Personas'
  | 'Controles Físicos'
  | 'Controles Tecnológicos';

// Matriz de controles SOA
export interface ControlMatrix {
  categoria: string;
  controles: AnexoSOA[];
  totalControles: number;
}

// Agrupación de anexos por categoría
export interface AnexosGrouped {
  categoria: string;
  controles: AnexoSOA[];
  count: number;
}

// Respuesta de la matriz de anexos
export interface MatrizAnexos {
  matrix: ControlMatrix[];
  stats: AnexoSOAStats;
  totalControles: number;
  totalCategorias: number;
}

// Cobertura de controles SOA
export interface ComplianceCoverage {
  categoria: string;
  controlesExistentes: number;
  controlesRecomendados: number;
  cobertura: number;
  controlesFaltantes: string[];
}

// Reporte de cumplimiento SOA
export interface SOAComplianceReport {
  resumenEjecutivo: {
    puntuacionGeneral: number;
    controlesImplementados: number;
    controlesRecomendados: number;
    brechasCriticas: number;
  };
  detallesPorCategoria: ComplianceCoverage[];
  estadisticas: AnexoSOAStats;
  matrizControles: ControlMatrix[];
  recomendaciones: string[];
  fechaReporte: Date;
}

// Dashboard de anexos SOA
export interface DashboardAnexos {
  resumen: {
    totalControles: number;
    totalPosibles: number;
    cumplimientoPromedio: number;
    brechasIdentificadas: number;
  };
  distribucion: {
    porCategoria: Array<{
      categoria: string;
      cantidad: number;
      porcentaje: number;
    }>;
    porUsuario: Array<{
      usuario: string;
      cantidad: number;
    }>;
  };
  cobertura: Array<{
    categoria: string;
    cobertura: number;
    controlesExistentes: number;
    controlesRecomendados: number;
  }>;
  alertas: {
    categoriasBajaCobertura: Array<{
      categoria: string;
      cobertura: number;
      controlesFaltantes: string[];
    }>;
    categoriasSinControles: Array<{
      categoria: string;
      controlesExistentes: number;
    }>;
  };
  tendencias: {
    creadasEsteAno: number;
    actualizadasEsteAno: number;
  };
}