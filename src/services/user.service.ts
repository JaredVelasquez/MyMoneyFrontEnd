import ApiService from './api.service';
import type { 
  User,
  UpdateUserRequest
} from '../types';
import type { AxiosResponse } from 'axios';

export class UserService extends ApiService {
  private readonly baseEndpoint = '/users';

  constructor() {
    super();
  }

  /**
   * Get current user profile
   */
  public async getCurrentUser(): Promise<AxiosResponse<User>> {
    return this.get<User>(`${this.baseEndpoint}/me`);
  }

  /**
   * Update user profile
   */
  public async updateProfile(updateRequest: UpdateUserRequest): Promise<AxiosResponse<User>> {
    return this.put<User>(`${this.baseEndpoint}/me`, updateRequest);
  }

  /**
   * Get user by ID (admin only)
   */
  public async getUserById(id: string): Promise<AxiosResponse<User>> {
    return this.get<User>(`${this.baseEndpoint}/${id}`);
  }

  /**
   * Get all users (admin only)
   */
  public async getUsers(params?: { page?: number; limit?: number; }): Promise<AxiosResponse<{ data: User[]; total: number }>> {
    return this.get<{ data: User[]; total: number }>(this.baseEndpoint, { params });
  }
} 