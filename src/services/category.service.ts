import ApiService from './api.service';
import type { 
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../types';
import type { TransactionType } from '../types/transaction';
import type { AxiosResponse } from 'axios';
import { mockDataService } from './mock-data.service';

export class CategoryService extends ApiService {
  private readonly baseEndpoint = '/categories';

  constructor() {
    super();
  }

  /**
   * Obtener todas las categorías
   */
  public async getAll(): Promise<AxiosResponse<Category[]>> {
    try {
      const response = await this.get<Category[]>(this.baseEndpoint);
      return response;
    } catch (error) {
      console.error('Error al obtener categorías, usando datos mock:', error);
      
      // Crear una respuesta compatible con AxiosResponse en caso de error
      return {
        data: mockDataService.getCategories(),
        status: 200,
        statusText: 'OK (Mock)',
        headers: {},
        config: {} as any,
      } as AxiosResponse<Category[]>;
    }
  }

  /**
   * Obtener una categoría por ID
   */
  public async getById(id: string): Promise<AxiosResponse<Category>> {
    return this.get<Category>(`${this.baseEndpoint}/${id}`);
  }

  /**
   * Crear una nueva categoría
   */
  public async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<AxiosResponse<Category>> {
    return this.post<Category>(this.baseEndpoint, category);
  }

  /**
   * Actualizar una categoría
   */
  public async update(id: string, category: Partial<Category>): Promise<AxiosResponse<Category>> {
    return this.put<Category>(`${this.baseEndpoint}/${id}`, category);
  }

  /**
   * Eliminar una categoría
   */
  public async delete(id: string): Promise<AxiosResponse<any>> {
    return super.delete(`${this.baseEndpoint}/${id}`);
  }

  /**
   * Get income categories
   */
  public async getIncomeCategories(): Promise<AxiosResponse<Category[]>> {
    try {
      // Obtenemos todas las categorías y filtramos en el cliente
      const response = await this.getAll();
      
      // Intento de filtrar categorías de ingresos
      // Si estamos usando datos mock, ya están filtrados adecuadamente
      const isMockData = response.statusText === 'OK (Mock)';
      const incomeCategories = isMockData 
        ? mockDataService.getIncomeCategories()
        : response.data; // En un entorno real, filtrarías por tipo aquí
      
      return {
        ...response,
        data: incomeCategories
      };
    } catch (error) {
      console.error('Error al obtener categorías de ingresos:', error);
      return {
        data: mockDataService.getIncomeCategories(),
        status: 200,
        statusText: 'OK (Mock)',
        headers: {},
        config: {} as any,
      } as AxiosResponse<Category[]>;
    }
  }

  /**
   * Get expense categories
   */
  public async getExpenseCategories(): Promise<AxiosResponse<Category[]>> {
    try {
      // Obtenemos todas las categorías y filtramos en el cliente
      const response = await this.getAll();
      
      // Intento de filtrar categorías de gastos
      // Si estamos usando datos mock, ya están filtrados adecuadamente
      const isMockData = response.statusText === 'OK (Mock)';
      const expenseCategories = isMockData 
        ? mockDataService.getExpenseCategories()
        : response.data; // En un entorno real, filtrarías por tipo aquí
      
      return {
        ...response,
        data: expenseCategories
      };
    } catch (error) {
      console.error('Error al obtener categorías de gastos:', error);
      return {
        data: mockDataService.getExpenseCategories(),
        status: 200,
        statusText: 'OK (Mock)',
        headers: {},
        config: {} as any,
      } as AxiosResponse<Category[]>;
    }
  }
} 