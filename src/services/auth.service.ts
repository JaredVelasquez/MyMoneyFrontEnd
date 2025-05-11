import ApiService from './api.service';
import type { 
  User,
  ChangePasswordRequest 
} from '../types';
import type { 
  LoginFormValues, 
  RegisterFormValues 
} from '../lib/validations/auth';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

class AuthService extends ApiService {
  constructor() {
    super();
  }

  /**
   * Login user
   */
  public async login(data: LoginFormValues): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/login', data);
    
    // Store tokens in localStorage - asegurarse de usar las claves correctas de la respuesta
    localStorage.setItem('accessToken', response.data.access_token);
    localStorage.setItem('refreshToken', response.data.refresh_token);
    
    // También podemos guardar la información del usuario
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  }

  /**
   * Register new user
   */
  public async register(data: Omit<RegisterFormValues, 'confirmPassword'>): Promise<User> {
    const response = await this.post<User>('/auth/register', data);
    return response.data;
  }

  /**
   * Refresh token
   */
  public async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await this.post<{ access_token: string }>('/auth/refresh-token', { refresh_token: refreshToken });
    localStorage.setItem('accessToken', response.data.access_token);
    
    return response.data.access_token;
  }

  /**
   * Change password
   */
  public async changePassword(changePasswordRequest: ChangePasswordRequest): Promise<void> {
    await this.post<void>('/auth/change-password', changePasswordRequest);
  }

  /**
   * Logout user
   */
  public async logout(): Promise<void> {
    try {
      await this.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  /**
   * Get current user profile
   */
  public async getCurrentUser(): Promise<User> {
    try {
      const response = await this.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      // Si falla, intentamos usar la información guardada en localStorage
      const userJson = localStorage.getItem('user');
      if (userJson) {
        return JSON.parse(userJson);
      }
      throw error;
    }
  }
}

// Create a singleton instance
export const authService = new AuthService(); 