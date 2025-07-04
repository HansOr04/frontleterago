import api from './api';
import { 
  Normativa, 
  NormativaFilters, 
  NormativaStats,
  CreateNormativaData,
  UpdateNormativaData,
  NormativasGrouped,
  ReporteVencimientos
} from '../types/normativas.types';
import { ApiResponse } from '../types/api.types';

class NormativasService {
  private readonly baseEndpoint = '/normativas';

  // Obtener todas las normativas con filtros y paginación
  async getAllNormativas(filters?: NormativaFilters): Promise<ApiResponse<Normativa[]>> {
    return await api.get(`${this.baseEndpoint}`, filters);
  }

  // Obtener normativa por ID
  async getNormativaById(id: string): Promise<ApiResponse<{ normativa: Normativa }>> {
    return await api.get(`${this.baseEndpoint}/${id}`);
  }

  // Crear nueva normativa
  async createNormativa(data: CreateNormativaData): Promise<ApiResponse<{ normativa: Normativa }>> {
    return await api.post(`${this.baseEndpoint}`, data);
  }

  // Actualizar normativa
  async updateNormativa(id: string, data: UpdateNormativaData): Promise<ApiResponse<{ normativa: Normativa }>> {
    return await api.put(`${this.baseEndpoint}/${id}`, data);
  }

  // Eliminar normativa
  async deleteNormativa(id: string): Promise<ApiResponse<void>> {
    return await api.delete(`${this.baseEndpoint}/${id}`);
  }

  // Obtener estadísticas de normativas
  async getStats(): Promise<ApiResponse<{ stats: NormativaStats }>> {
    return await api.get(`${this.baseEndpoint}/stats`);
  }

  // Obtener normativas próximas a vencer
  async getNormativasExpiringSoon(days: number = 30): Promise<ApiResponse<Normativa[]>> {
    return await api.get(`${this.baseEndpoint}/expiring-soon`, { days });
  }

  // Obtener normativas vencidas
  async getNormativasExpired(): Promise<ApiResponse<Normativa[]>> {
    return await api.get(`${this.baseEndpoint}/expired`);
  }

  // Buscar normativas
  async searchNormativas(searchTerm: string, filters?: Omit<NormativaFilters, 'search'>): Promise<ApiResponse<Normativa[]>> {
    return await api.get(`${this.baseEndpoint}/search`, { search: searchTerm, ...filters });
  }

  // Obtener normativas por categoría
  async getNormativasByCategory(categoria: string, filters?: Omit<NormativaFilters, 'categoria'>): Promise<ApiResponse<Normativa[]>> {
    return await api.get(`${this.baseEndpoint}/categoria/${categoria}`, filters);
  }

  // Obtener normativas del usuario actual
  async getMyNormativas(filters?: NormativaFilters): Promise<ApiResponse<Normativa[]>> {
    return await api.get(`${this.baseEndpoint}/user/my-normativas`, filters);
  }

  // Verificar estado de vencimiento de una normativa
  async checkExpiration(id: string): Promise<ApiResponse<{
    isExpired: boolean;
    daysUntilExpiration: number;
    status: string;
  }>> {
    return await api.get(`${this.baseEndpoint}/${id}/expiration-check`);
  }

  // Clonar normativa
  async cloneNormativa(id: string, newData?: Partial<CreateNormativaData>): Promise<ApiResponse<{ normativa: Normativa }>> {
    return await api.post(`${this.baseEndpoint}/${id}/clone`, newData);
  }

  // Obtener reporte de vencimientos
  async getExpirationReport(): Promise<ApiResponse<{ report: ReporteVencimientos }>> {
    return await api.get(`${this.baseEndpoint}/expiration-report`);
  }

  // Exportar normativas
  async exportNormativas(filters?: NormativaFilters): Promise<ApiResponse<{
    normativas: any[];
    total: number;
    fechaExportacion: Date;
  }>> {
    return await api.get(`${this.baseEndpoint}/admin/export`, filters);
  }

  // Obtener normativas agrupadas por categoría
  async getNormativasGroupedByCategory(): Promise<ApiResponse<{
    groups: NormativasGrouped[];
    totalCategories: number;
  }>> {
    return await api.get(`${this.baseEndpoint}/grouped-by-category`);
  }

  // Obtener dashboard de normativas
  async getDashboard(): Promise<ApiResponse<{ dashboard: any }>> {
    return await api.get(`${this.baseEndpoint}/dashboard`);
  }

  // Health check del servicio
  async healthCheck(): Promise<ApiResponse<any>> {
    return await api.get(`${this.baseEndpoint}/health`);
  }

  // Validar normativa (verificar duplicados)
  async validateNormativa(nombre: string, categoria: string): Promise<boolean> {
    try {
      const result = await this.searchNormativas(nombre, { categoria });
      if (result.success && result.data) {
        return !result.data.some(n => 
          n.nombre.toLowerCase() === nombre.toLowerCase() && 
          n.categoria === categoria
        );
      }
      return true;
    } catch (error) {
      console.error('Error validating normativa:', error);
      return true; // En caso de error, permitir continuar
    }
  }

  // Calcular estado de normativa
  calculateStatus(fechaVencimiento: Date): { estado: string; diasHastaVencimiento: number } {
    const now = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const timeDiff = vencimiento.getTime() - now.getTime();
    const diasHastaVencimiento = Math.ceil(timeDiff / (1000 * 3600 * 24));

    let estado: string;
    if (diasHastaVencimiento < 0) {
      estado = 'vencida';
    } else if (diasHastaVencimiento <= 7) {
      estado = 'critica';
    } else if (diasHastaVencimiento <= 30) {
      estado = 'proxima';
    } else {
      estado = 'vigente';
    }

    return { estado, diasHastaVencimiento };
  }

  // Formatear fecha para el backend
  formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      return date;
    }
    return date.toISOString();
  }

  // Parsear fecha del backend
  parseDate(dateString: string): Date {
    return new Date(dateString);
  }
}

export default new NormativasService();