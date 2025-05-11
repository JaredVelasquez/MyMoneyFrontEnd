import ApiService from './api.service';
import type { PaymentMethod, CreatePaymentMethodRequest, UpdatePaymentMethodRequest } from '../types';
import type { AxiosResponse } from 'axios';
import { mockDataService } from './mock-data.service';

export class PaymentMethodService extends ApiService {
  private readonly baseEndpoint = '/payment-methods';
  private simulateMode = false;

  constructor(simulateMode = false) {
    super();
    this.simulateMode = simulateMode;
  }

  /**
   * Get all payment methods
   */
  public async getAll(): Promise<AxiosResponse<PaymentMethod[]>> {
    try {
      if (this.simulateMode) {
        console.log('Usando modo simulado para obtener métodos de pago');
        return this.simulateResponse(mockDataService.getPaymentMethods());
      }

      const fullUrl = this.getFullUrl(this.baseEndpoint);
      console.log('URL completa para obtener métodos de pago:', fullUrl);
      
      const response = await this.get<PaymentMethod[]>(this.baseEndpoint);
      
      // Asegurar que la respuesta sea un array
      if (!Array.isArray(response.data)) {
        console.error('La respuesta de métodos de pago no es un array:', response.data);
        
        // Usar datos mock si la respuesta no es válida
        return this.simulateResponse(mockDataService.getPaymentMethods());
      }
      
      // Depuración para ver la estructura de la respuesta
      console.log('Respuesta de métodos de pago:', JSON.stringify(response.data, null, 2));
      
      return response;
    } catch (error) {
      console.error('Error al obtener métodos de pago:', error);
      
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
      
      // Usar datos mock cuando falla la conexión
      console.log('Usando datos mock para métodos de pago debido a error de conexión');
      return this.simulateResponse(mockDataService.getPaymentMethods());
    }
  }

  /**
   * Alias para getAll() para mantener compatibilidad
   */
  public async getPaymentMethods(): Promise<AxiosResponse<PaymentMethod[]>> {
    return this.getAll();
  }

  /**
   * Get payment method by ID
   */
  public async getPaymentMethodById(id: string): Promise<AxiosResponse<PaymentMethod>> {
    try {
      if (this.simulateMode) {
        const mockMethods = mockDataService.getPaymentMethods();
        const method = mockMethods.find(m => m.id === id) || mockMethods[0];
        return this.simulateResponse(method);
      }
      
      return await this.get<PaymentMethod>(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      console.error(`Error al obtener método de pago con ID ${id}:`, error);
      // Buscar en los datos mock o devolver el primero
      const mockMethods = mockDataService.getPaymentMethods();
      const method = mockMethods.find(m => m.id === id) || mockMethods[0];
      return this.simulateResponse(method);
    }
  }
  
  /**
   * Create new payment method
   */
  public async createPaymentMethod(paymentMethod: CreatePaymentMethodRequest): Promise<AxiosResponse<PaymentMethod>> {
    try {
      if (this.simulateMode) {
        // Crear un método de pago simulado
        const mockMethod: PaymentMethod = {
          id: `mock-${Date.now()}`,
          name: paymentMethod.name,
          description: paymentMethod.description || '',
          icon: paymentMethod.icon || '💳',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return this.simulateResponse(mockMethod);
      }
      
      console.log('Creando método de pago con datos:', JSON.stringify(paymentMethod, null, 2));
      const response = await this.post<PaymentMethod>(this.baseEndpoint, paymentMethod);
      console.log('Método de pago creado:', JSON.stringify(response.data, null, 2));
      return response;
    } catch (error) {
      console.error('Error al crear método de pago:', error);
      
      // Crear un método de pago simulado en caso de error
      const mockMethod: PaymentMethod = {
        id: `mock-${Date.now()}`,
        name: paymentMethod.name,
        description: paymentMethod.description || '',
        icon: paymentMethod.icon || '💳',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return this.simulateResponse(mockMethod);
    }
  }

  /**
   * Update payment method
   */
  public async updatePaymentMethod(id: string, paymentMethod: UpdatePaymentMethodRequest): Promise<AxiosResponse<PaymentMethod>> {
    try {
      if (this.simulateMode) {
        // Simular actualización
        const mockMethod: PaymentMethod = {
          id,
          name: paymentMethod.name || 'Método actualizado',
          description: paymentMethod.description || '',
          icon: paymentMethod.icon || '💳',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return this.simulateResponse(mockMethod);
      }
      
      console.log(`Actualizando método de pago ${id} con datos:`, JSON.stringify(paymentMethod, null, 2));
      const response = await this.put<PaymentMethod>(`${this.baseEndpoint}/${id}`, paymentMethod);
      console.log('Método de pago actualizado:', JSON.stringify(response.data, null, 2));
      return response;
    } catch (error) {
      console.error('Error al actualizar método de pago:', error);
      
      // Simular actualización en caso de error
      const mockMethod: PaymentMethod = {
        id,
        name: paymentMethod.name || 'Método actualizado',
        description: paymentMethod.description || '',
        icon: paymentMethod.icon || '💳',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return this.simulateResponse(mockMethod);
    }
  }

  /**
   * Delete payment method
   */
  public async deletePaymentMethod(id: string): Promise<AxiosResponse<void>> {
    try {
      if (this.simulateMode) {
        console.log(`Simulando eliminación del método de pago ${id}`);
        return this.simulateResponse(undefined);
      }
      
      console.log(`Eliminando método de pago ${id}`);
      const response = await this.delete<void>(`${this.baseEndpoint}/${id}`);
      console.log('Método de pago eliminado correctamente');
      return response;
    } catch (error) {
      console.error('Error al eliminar método de pago:', error);
      return this.simulateResponse(undefined);
    }
  }
  
  /**
   * Obtener la URL completa para depuración
   */
  private getFullUrl(path: string): string {
    const baseUrl = this.getBaseURL();
    return `${baseUrl}${path}`;
  }
  
  /**
   * Helper para crear respuestas simuladas
   */
  private simulateResponse<T>(data: T): AxiosResponse<T> {
    return {
      data,
      status: 200,
      statusText: 'OK (Simulated)',
      headers: {},
      config: {} as any
    };
  }
} 