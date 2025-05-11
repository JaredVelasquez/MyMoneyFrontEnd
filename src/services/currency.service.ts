import ApiService from './api.service';
import type { AxiosResponse } from 'axios';
import type { Currency } from '../types';
import { mockDataService } from './mock-data.service';

export class CurrencyService extends ApiService {
  private readonly baseEndpoint = '/currencies';

  constructor() {
    super();
  }

  /**
   * Obtener todas las monedas
   */
  public async getAll(): Promise<AxiosResponse<Currency[]>> {
    try {
      const response = await this.get<Currency[]>(this.baseEndpoint);
      return response;
    } catch (error) {
      console.error('Error al obtener monedas, usando datos mock:', error);
      
      // Crear una respuesta compatible con AxiosResponse en caso de error
      return {
        data: mockDataService.getCurrencies(),
        status: 200,
        statusText: 'OK (Mock)',
        headers: {},
        config: {} as any,
      } as AxiosResponse<Currency[]>;
    }
  }

  /**
   * Obtener una moneda por ID
   */
  public async getById(id: string): Promise<AxiosResponse<Currency>> {
    return this.get<Currency>(`${this.baseEndpoint}/${id}`);
  }

  /**
   * Crear una nueva moneda
   */
  public async create(currency: Omit<Currency, 'id' | 'created_at' | 'updated_at'>): Promise<AxiosResponse<Currency>> {
    return this.post<Currency>(this.baseEndpoint, currency);
  }

  /**
   * Actualizar una moneda
   */
  public async update(id: string, currency: Partial<Currency>): Promise<AxiosResponse<Currency>> {
    return this.put<Currency>(`${this.baseEndpoint}/${id}`, currency);
  }

  /**
   * Eliminar una moneda
   */
  public async delete(id: string): Promise<AxiosResponse<any>> {
    return super.delete(`${this.baseEndpoint}/${id}`);
  }

  /**
   * Establecer una moneda como predeterminada
   */
  public async setDefault(id: string): Promise<AxiosResponse<Currency>> {
    return this.patch<Currency>(`${this.baseEndpoint}/${id}/set-default`, {});
  }
} 