import api from './api';
import { 
  AnexoSOA, 
  AnexoSOAFilters, 
  AnexoSOAStats,
  CreateAnexoSOAData,
  UpdateAnexoSOAData,
  ControlMatrix,
  ComplianceCoverage,
  SOAComplianceReport,
  DashboardAnexos
} from '../types/anexos.types';
import { ApiResponse } from '../types/api.types';

class AnexosService {
  private readonly baseEndpoint = '/anexos';

  // Obtener todos los anexos SOA con filtros y paginación
  async getAllAnexos(filters?: AnexoSOAFilters): Promise<ApiResponse<AnexoSOA[]>> {
    return await api.get(`${this.baseEndpoint}`, filters);
  }

  // Obtener anexo SOA por ID
  async getAnexoById(id: string): Promise<ApiResponse<{ anexo: AnexoSOA }>> {
    return await api.get(`${this.baseEndpoint}/${id}`);
  }

  // Crear nuevo anexo SOA
  async createAnexo(data: CreateAnexoSOAData): Promise<ApiResponse<{ anexo: AnexoSOA }>> {
    return await api.post(`${this.baseEndpoint}`, data);
  }

  // Actualizar anexo SOA
  async updateAnexo(id: string, data: UpdateAnexoSOAData): Promise<ApiResponse<{ anexo: AnexoSOA }>> {
    return await api.put(`${this.baseEndpoint}/${id}`, data);
  }

  // Eliminar anexo SOA
  async deleteAnexo(id: string): Promise<ApiResponse<void>> {
    return await api.delete(`${this.baseEndpoint}/${id}`);
  }

  // Obtener estadísticas de anexos SOA
  async getStats(): Promise<ApiResponse<{ stats: AnexoSOAStats }>> {
    return await api.get(`${this.baseEndpoint}/stats`);
  }

  // Obtener matriz de controles agrupados por categoría
  async getControlMatrix(): Promise<ApiResponse<{
    matrix: ControlMatrix[];
    totalControles: number;
    totalCategorias: number;
    fechaConsulta: Date;
  }>> {
    return await api.get(`${this.baseEndpoint}/matrix`);
  }

  // Buscar anexos SOA
  async searchAnexos(searchTerm: string, filters?: Omit<AnexoSOAFilters, 'search'>): Promise<ApiResponse<AnexoSOA[]>> {
    return await api.get(`${this.baseEndpoint}/search`, { search: searchTerm, ...filters });
  }

  // Obtener anexos SOA por categoría
  async getAnexosByCategory(categoria: string, filters?: Omit<AnexoSOAFilters, 'categoria'>): Promise<ApiResponse<AnexoSOA[]>> {
    return await api.get(`${this.baseEndpoint}/categoria/${categoria}`, filters);
  }

  // Obtener anexos SOA del usuario actual
  async getMyAnexos(filters?: AnexoSOAFilters): Promise<ApiResponse<AnexoSOA[]>> {
    return await api.get(`${this.baseEndpoint}/user/my-anexos`, filters);
  }

  // Obtener cobertura de controles SOA
  async getComplianceCoverage(): Promise<ApiResponse<{ coverage: ComplianceCoverage[] }>> {
    return await api.get(`${this.baseEndpoint}/compliance/coverage`);
  }

  // Búsqueda avanzada de anexos SOA
  async advancedSearch(searchParams: any): Promise<ApiResponse<{
    anexos: AnexoSOA[];
    total: number;
    searchParams: any;
  }>> {
    return await api.post(`${this.baseEndpoint}/advanced-search`, searchParams);
  }

  // Clonar anexo SOA
  async cloneAnexo(id: string, newData?: Partial<CreateAnexoSOAData>): Promise<ApiResponse<{ anexo: AnexoSOA }>> {
    return await api.post(`${this.baseEndpoint}/${id}/clone`, newData);
  }

  // Exportar anexos SOA
  async exportAnexos(filters?: AnexoSOAFilters): Promise<ApiResponse<{
    anexos: any[];
    total: number;
    fechaExportacion: Date;
    filtros: AnexoSOAFilters;
  }>> {
    return await api.get(`${this.baseEndpoint}/admin/export`, filters);
  }

  // Importar anexos SOA masivamente
  async importAnexos(anexos: CreateAnexoSOAData[]): Promise<ApiResponse<{
    result: {
      total: number;
      exitosos: number;
      fallidos: number;
      errores: any[];
      anexosCreados: AnexoSOA[];
    };
  }>> {
    return await api.post(`${this.baseEndpoint}/admin/import`, { anexos });
  }

  // Obtener anexos SOA agrupados por categoría
  async getAnexosGroupedByCategory(): Promise<ApiResponse<{
    groups: any[];
    totalCategories: number;
  }>> {
    return await api.get(`${this.baseEndpoint}/grouped-by-category`);
  }

  // Verificar integridad de datos
  async verifyDataIntegrity(): Promise<ApiResponse<{ integrity: any }>> {
    return await api.get(`${this.baseEndpoint}/admin/verify-integrity`);
  }

  // Obtener dashboard de anexos SOA
  async getDashboard(): Promise<ApiResponse<{ dashboard: DashboardAnexos }>> {
    return await api.get(`${this.baseEndpoint}/dashboard`);
  }

  // Validar control SOA
  async validateControl(nombreControl: string, categoria: string): Promise<ApiResponse<{
    valid: boolean;
    exists: boolean;
    nombreControl: string;
    categoria: string;
  }>> {
    return await api.post(`${this.baseEndpoint}/validate-control`, {
      nombreControl,
      categoria
    });
  }

  // Obtener reporte de cumplimiento SOA
  async getSOAComplianceReport(): Promise<ApiResponse<{ report: SOAComplianceReport }>> {
    return await api.get(`${this.baseEndpoint}/compliance/report`);
  }

  // Health check del servicio
  async healthCheck(): Promise<ApiResponse<any>> {
    return await api.get(`${this.baseEndpoint}/health`);
  }

  // Métodos auxiliares

  // Calcular progreso de implementación
  calculateImplementationProgress(totalImplemented: number, totalRecommended: number): number {
    if (totalRecommended === 0) return 0;
    return Math.round((totalImplemented / totalRecommended) * 100);
  }

  // Obtener color de categoria para la matriz
  getCategoryColor(categoria: string): string {
    const colorMap: Record<string, string> = {
      'Controles Organizacionales': 'matrix-org',
      'Controles de Personas': 'matrix-people', 
      'Controles Físicos': 'matrix-physical',
      'Controles Tecnológicos': 'matrix-tech'
    };
    return colorMap[categoria] || 'bg-gray-500';
  }

  // Formatear texto de búsqueda
  formatSearchTerm(term: string): string {
    return term.trim().toLowerCase();
  }

  // Validar datos de anexo antes de enviar
  validateAnexoData(data: CreateAnexoSOAData | UpdateAnexoSOAData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if ('nombreControl' in data) {
      if (!data.nombreControl || data.nombreControl.length < 3) {
        errors.push('El nombre del control debe tener al menos 3 caracteres');
      }
      if (data.nombreControl && data.nombreControl.length > 200) {
        errors.push('El nombre del control no puede tener más de 200 caracteres');
      }
    }

    if ('categoria' in data) {
      if (!data.categoria) {
        errors.push('La categoría es requerida');
      }
    }

    if ('descripcion' in data) {
      if (!data.descripcion || data.descripcion.length < 10) {
        errors.push('La descripción debe tener al menos 10 caracteres');
      }
      if (data.descripcion && data.descripcion.length > 2000) {
        errors.push('La descripción no puede tener más de 2000 caracteres');
      }
    }

    if ('ubicacion' in data) {
      if (!data.ubicacion) {
        errors.push('La ubicación es requerida');
      }
      if (data.ubicacion && data.ubicacion.length > 500) {
        errors.push('La ubicación no puede tener más de 500 caracteres');
      }
    }

    if ('observaciones' in data && data.observaciones) {
      if (data.observaciones.length > 1000) {
        errors.push('Las observaciones no pueden tener más de 1000 caracteres');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new AnexosService();