import ApiService from './api.service';
import type { 
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  DateRangeRequest,
  TransactionType
} from '../types';
import type { AxiosResponse } from 'axios';

export interface TransactionFilter {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: 'EXPENSE' | 'INCOME';
  paymentMethodId?: string;
  currencyId?: string;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}

export class TransactionService extends ApiService {
  private readonly baseEndpoint = '/transactions';
  private simulateMode = false;

  constructor(simulateMode = false) {
    super();
    this.simulateMode = simulateMode;
  }

  /**
   * Obtener todas las transacciones
   */
  public async getAll(filters?: TransactionFilter): Promise<AxiosResponse<Transaction[]>> {
    let url = this.baseEndpoint;
    
    // Si hay filtros, los añadimos como query params
    if (filters) {
      const params = new URLSearchParams();
      
      if (filters.startDate) params.append('start_date', filters.startDate);
      if (filters.endDate) params.append('end_date', filters.endDate);
      if (filters.categoryId) params.append('category_id', filters.categoryId);
      if (filters.type) params.append('type', filters.type);
      if (filters.paymentMethodId) params.append('payment_method_id', filters.paymentMethodId);
      if (filters.currencyId) params.append('currency_id', filters.currencyId);
      if (filters.minAmount) params.append('min_amount', filters.minAmount.toString());
      if (filters.maxAmount) params.append('max_amount', filters.maxAmount.toString());
      if (filters.searchTerm) params.append('search', filters.searchTerm);
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    try {
      return await this.get<Transaction[]>(url);
    } catch (error) {
      if (this.simulateMode) {
        console.warn('Usando modo de simulación para getAll() - Backend no disponible');
        return this.simulateResponse([]);
      }
      throw error;
    }
  }

  /**
   * Obtener una transacción por ID
   */
  public async getById(id: string): Promise<AxiosResponse<Transaction>> {
    try {
      return await this.get<Transaction>(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      if (this.simulateMode) {
        console.warn('Usando modo de simulación para getById() - Backend no disponible');
        return this.simulateResponse(this.createMockTransaction(id));
      }
      throw error;
    }
  }

  /**
   * Crear una nueva transacción
   */
  public async create(transaction: CreateTransactionRequest): Promise<AxiosResponse<Transaction>> {
    try {
      return await this.post<Transaction>(this.baseEndpoint, transaction);
    } catch (error) {
      if (this.simulateMode) {
        console.warn('Usando modo de simulación para create() - Backend no disponible');
        // Crear una transacción simulada con los datos recibidos
        const mockTransaction: Transaction = {
          id: `mock-${Date.now()}`,
          amount: transaction.amount,
          description: transaction.description || 'Transacción simulada',
          date: transaction.date,
          category_id: transaction.category_id,
          payment_method_id: transaction.payment_method_id || '',
          user_id: 'current-user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          type: transaction.type,
          currency_id: transaction.currency_id
        };
        return this.simulateResponse(mockTransaction);
      }
      throw error;
    }
  }

  /**
   * Actualizar una transacción
   */
  public async update(id: string, transaction: Partial<Transaction>): Promise<AxiosResponse<Transaction>> {
    try {
      return await this.put<Transaction>(`${this.baseEndpoint}/${id}`, transaction);
    } catch (error) {
      if (this.simulateMode) {
        console.warn('Usando modo de simulación para update() - Backend no disponible');
        const mockTransaction = this.createMockTransaction(id);
        return this.simulateResponse({ ...mockTransaction, ...transaction });
      }
      throw error;
    }
  }

  /**
   * Eliminar una transacción
   */
  public async delete(id: string): Promise<AxiosResponse<any>> {
    try {
      return await super.delete(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      if (this.simulateMode) {
        console.warn('Usando modo de simulación para delete() - Backend no disponible');
        return this.simulateResponse({ success: true });
      }
      throw error;
    }
  }

  /**
   * Obtener resumen de transacciones (para dashboard)
   */
  public async getSummary(): Promise<AxiosResponse<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
    recentTransactions: Transaction[];
    expenseByCategory: Array<{
      categoryId: string;
      categoryName: string;
      amount: number;
      percentage: number;
    }>;
  }>> {
    try {
      return await this.get<any>(`${this.baseEndpoint}/summary`);
    } catch (error) {
      if (this.simulateMode) {
        console.warn('Usando modo de simulación para getSummary() - Backend no disponible');
        return this.simulateResponse({
          totalIncome: 1000,
          totalExpense: 750,
          balance: 250,
          recentTransactions: [],
          expenseByCategory: []
        });
      }
      throw error;
    }
  }

  /**
   * Get all transactions
   */
  public async getTransactions(params?: { page?: number; limit?: number; }): Promise<AxiosResponse<{ data: Transaction[]; total: number }>> {
    try {
      const response = await this.get<Transaction[]>(this.baseEndpoint, { params });
      
      // Transformar la respuesta al formato esperado
      return {
        data: {
          data: response.data,
          total: response.data.length
        },
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: response.config
      };
    } catch (error) {
      console.error('Error al obtener transacciones:', error);
      
      if (this.simulateMode) {
        console.warn('Usando modo de simulación para getTransactions() - Backend no disponible');
        return this.simulateResponse({
          data: [],
          total: 0
        });
      }
      
      throw error;
    }
  }

  /**
   * Get transactions by date range
   */
  public async getTransactionsByDateRange(dateRange: DateRangeRequest): Promise<AxiosResponse<{ data: Transaction[]; total: number }>> {
    try {
      const response = await this.get<Transaction[]>(`${this.baseEndpoint}/date-range`, { params: dateRange });
      
      // Transformar la respuesta al formato esperado
      return {
        data: {
          data: response.data,
          total: response.data.length
        },
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: response.config
      };
    } catch (error) {
      console.error('Error al obtener transacciones por rango de fecha:', error);
      
      if (this.simulateMode) {
        console.warn('Usando modo de simulación para getTransactionsByDateRange() - Backend no disponible');
        return this.simulateResponse({
          data: [],
          total: 0
        });
      }
      
      throw error;
    }
  }

  /**
   * Get transaction statistics
   */
  public async getTransactionStats(dateRange: DateRangeRequest): Promise<AxiosResponse<Record<string, number>>> {
    try {
      return await this.get<Record<string, number>>(`${this.baseEndpoint}/stats`, { params: dateRange });
    } catch (error) {
      if (this.simulateMode) {
        console.warn('Usando modo de simulación para getTransactionStats() - Backend no disponible');
        return this.simulateResponse({
          total: 0,
          income: 0,
          expense: 0
        });
      }
      throw error;
    }
  }

  /**
   * Get transaction summary by category
   */
  public async getTransactionSummaryByCategory(dateRange: DateRangeRequest): Promise<AxiosResponse<Array<{category: string, amount: number}>>> {
    return this.get<Array<{category: string, amount: number}>>(`${this.baseEndpoint}/summary/category`, { params: dateRange });
  }

  /**
   * Export transactions to CSV
   */
  public async exportTransactionsToCSV(dateRange: DateRangeRequest): Promise<void> {
    return this.downloadFile(`${this.baseEndpoint}/export/csv`, { params: dateRange as unknown as Record<string, unknown> }, 'transactions.csv');
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
  
  /**
   * Crear una transacción de prueba
   */
  private createMockTransaction(id: string): Transaction {
    return {
      id,
      amount: 100,
      description: 'Transacción simulada',
      date: new Date().toISOString(),
      category_id: '55555555-5555-5555-5555-555555555501', // ID de categoría mock
      payment_method_id: '33333333-3333-3333-3333-333333333333', // ID de método de pago mock
      user_id: 'current-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      type: 'EXPENSE',
      currency_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' // ID de moneda mock
    };
  }
} 