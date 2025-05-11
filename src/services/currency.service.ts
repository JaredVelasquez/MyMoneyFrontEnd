import ApiService from './api.service';
import type { AxiosResponse } from 'axios';
import type { Currency } from '../types';
import { mockDataService } from './mock-data.service';

export class CurrencyService extends ApiService {
  private readonly baseEndpoint = '/currencies';
  private simulateMode = false;

  constructor(simulateMode = false) {
    super();
    this.simulateMode = simulateMode;
  }

  /**
   * Obtener todas las monedas
   */
  public async getAll(): Promise<AxiosResponse<Currency[]>> {
    try {
      if (this.simulateMode) {
        console.log('Usando modo simulado para obtener monedas');
        return this.simulateResponse(mockDataService.getCurrencies());
      }
      
      const response = await this.get<Currency[]>(this.baseEndpoint);
      return response;
    } catch (error) {
      console.error('Error al obtener monedas, usando datos mock:', error);
      
      // Crear una respuesta compatible con AxiosResponse en caso de error
      return this.simulateResponse(mockDataService.getCurrencies());
    }
  }

  /**
   * Obtener una moneda por ID
   */
  public async getById(id: string): Promise<AxiosResponse<Currency>> {
    try {
      if (this.simulateMode) {
        const mockCurrencies = mockDataService.getCurrencies();
        const currency = mockCurrencies.find(c => c.id === id) || mockCurrencies[0];
        return this.simulateResponse(currency);
      }
      
      return await this.get<Currency>(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      console.error(`Error al obtener moneda con ID ${id}:`, error);
      // Buscar en los datos mock o devolver el primero
      const mockCurrencies = mockDataService.getCurrencies();
      const currency = mockCurrencies.find(c => c.id === id) || mockCurrencies[0];
      return this.simulateResponse(currency);
    }
  }

  /**
   * Crear una nueva moneda
   */
  public async create(currency: Omit<Currency, 'id' | 'created_at' | 'updated_at'>): Promise<AxiosResponse<Currency>> {
    try {
      if (this.simulateMode) {
        // Crear una moneda simulada
        const mockCurrency: Currency = {
          id: `mock-${Date.now()}`,
          name: currency.name,
          code: currency.code,
          symbol: currency.symbol,
          is_default: currency.is_default || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return this.simulateResponse(mockCurrency);
      }
      
      return await this.post<Currency>(this.baseEndpoint, currency);
    } catch (error) {
      console.error('Error al crear moneda:', error);
      
      // Crear una moneda simulada en caso de error
      const mockCurrency: Currency = {
        id: `mock-${Date.now()}`,
        name: currency.name,
        code: currency.code,
        symbol: currency.symbol,
        is_default: currency.is_default || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return this.simulateResponse(mockCurrency);
    }
  }

  /**
   * Actualizar una moneda
   */
  public async update(id: string, currency: Partial<Currency>): Promise<AxiosResponse<Currency>> {
    try {
      if (this.simulateMode) {
        // Simular actualización de moneda
        // Obtener la moneda existente de los datos mock
        const mockCurrencies = mockDataService.getCurrencies();
        const existingCurrency = mockCurrencies.find(c => c.id === id) || mockCurrencies[0];
        
        // Crear la moneda actualizada
        const updatedCurrency: Currency = {
          ...existingCurrency,
          ...currency,
          updated_at: new Date().toISOString()
        };
        
        return this.simulateResponse(updatedCurrency);
      }
      
      return await this.put<Currency>(`${this.baseEndpoint}/${id}`, currency);
    } catch (error) {
      console.error('Error al actualizar moneda:', error);
      
      // Simular actualización en caso de error
      const mockCurrencies = mockDataService.getCurrencies();
      const existingCurrency = mockCurrencies.find(c => c.id === id) || mockCurrencies[0];
      
      const updatedCurrency: Currency = {
        ...existingCurrency,
        ...currency,
        updated_at: new Date().toISOString()
      };
      
      return this.simulateResponse(updatedCurrency);
    }
  }

  /**
   * Eliminar una moneda
   */
  public async delete(id: string): Promise<AxiosResponse<any>> {
    try {
      if (this.simulateMode) {
        console.log(`Simulando eliminación de la moneda ${id}`);
        return this.simulateResponse({ success: true });
      }
      
      return await super.delete(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      console.error('Error al eliminar moneda:', error);
      return this.simulateResponse({ success: true });
    }
  }

  /**
   * Establecer una moneda como predeterminada
   */
  public async setDefault(id: string): Promise<AxiosResponse<Currency>> {
    try {
      if (this.simulateMode) {
        // Obtener las monedas de los datos mock
        const mockCurrencies = mockDataService.getCurrencies();
        
        // Encontrar la moneda a establecer como predeterminada
        const targetCurrency = mockCurrencies.find(c => c.id === id) || mockCurrencies[0];
        
        // Crear una copia con is_default = true
        const updatedCurrency: Currency = {
          ...targetCurrency,
          is_default: true,
          updated_at: new Date().toISOString()
        };
        
        return this.simulateResponse(updatedCurrency);
      }
      
      return await this.patch<Currency>(`${this.baseEndpoint}/${id}/set-default`, {});
    } catch (error) {
      console.error('Error al establecer moneda como predeterminada:', error);
      
      // Simular la operación en caso de error
      const mockCurrencies = mockDataService.getCurrencies();
      const targetCurrency = mockCurrencies.find(c => c.id === id) || mockCurrencies[0];
      
      const updatedCurrency: Currency = {
        ...targetCurrency,
        is_default: true,
        updated_at: new Date().toISOString()
      };
      
      return this.simulateResponse(updatedCurrency);
    }
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