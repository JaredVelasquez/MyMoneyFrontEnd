import ApiService from './api.service';
import type { AxiosResponse } from 'axios';
import type { PaymentMethod } from '../types';
import { mockDataService } from './mock-data.service';

export class PaymentMethodService extends ApiService {
  private readonly baseEndpoint = '/payment-methods';

  constructor() {
    super();
  }

  /**
   * Obtener todos los métodos de pago
   */
  public async getAll(): Promise<AxiosResponse<PaymentMethod[]>> {
    try {
      const fullUrl = this.getFullUrl(this.baseEndpoint);
      console.log('URL completa para obtener métodos de pago:', fullUrl);
      
      const response = await this.get<PaymentMethod[]>(this.baseEndpoint);
      
      // Asegurar que la respuesta sea un array
      if (!Array.isArray(response.data)) {
        console.error('La respuesta de métodos de pago no es un array:', response.data);
        
        // Crear una respuesta con datos mock
        return {
          data: mockDataService.getPaymentMethods(),
          status: 200,
          statusText: 'OK (Mock)',
          headers: {},
          config: {} as any,
        } as AxiosResponse<PaymentMethod[]>;
      }
      
      // Depuración para ver la estructura de la respuesta
      console.log('Respuesta de métodos de pago:', JSON.stringify(response.data, null, 2));
      
      return response;
    } catch (error) {
      console.error('Error al obtener métodos de pago, usando datos mock:', error);
      
      // Mostrar detalles del error si es un error de Axios
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('Detalles del error:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          headers: axiosError.response?.headers
        });
      }
      
      // Crear una respuesta compatible con AxiosResponse en caso de error
      return {
        data: mockDataService.getPaymentMethods(),
        status: 200,
        statusText: 'OK (Mock)',
        headers: {},
        config: {} as any,
      } as AxiosResponse<PaymentMethod[]>;
    }
  }

  /**
   * Alias para getAll() para mantener compatibilidad
   */
  public async getPaymentMethods(): Promise<AxiosResponse<PaymentMethod[]>> {
    return this.getAll();
  }

  /**
   * Obtener un método de pago por ID
   */
  public async getById(id: string): Promise<AxiosResponse<PaymentMethod>> {
    return this.get<PaymentMethod>(`${this.baseEndpoint}/${id}`);
  }

  /**
   * Crear un nuevo método de pago
   */
  public async create(paymentMethod: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>): Promise<AxiosResponse<PaymentMethod>> {
    return this.post<PaymentMethod>(this.baseEndpoint, paymentMethod);
  }

  /**
   * Actualizar un método de pago
   */
  public async update(id: string, paymentMethod: Partial<PaymentMethod>): Promise<AxiosResponse<PaymentMethod>> {
    return this.put<PaymentMethod>(`${this.baseEndpoint}/${id}`, paymentMethod);
  }

  /**
   * Eliminar un método de pago
   */
  public async delete(id: string): Promise<AxiosResponse<any>> {
    return super.delete(`${this.baseEndpoint}/${id}`);
  }

  /**
   * Obtener la URL completa para depuración
   */
  private getFullUrl(path: string): string {
    const baseUrl = this.getBaseURL();
    return `${baseUrl}${path}`;
  }
} 