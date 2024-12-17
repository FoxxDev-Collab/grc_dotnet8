import { BaseApi } from './base';
import type { ApiResponse } from '../../types/api';
import type { SystemUserResponse, SystemUserLoginResponse, UpdateSystemUserDto, CreateSystemUserDto } from '../../types/users';
import Cookies from 'js-cookie';

export class SystemUsersApi extends BaseApi {
  private static readonly BASE_PATH = '/system-users';

  static async getSystemUsers(): Promise<ApiResponse<SystemUserResponse[]>> {
    return this.get<SystemUserResponse[]>(this.BASE_PATH);
  }

  static async getSystemUser(id: string): Promise<ApiResponse<SystemUserResponse>> {
    return this.get<SystemUserResponse>(`${this.BASE_PATH}/${id}`);
  }

  static async getCurrentUser(): Promise<ApiResponse<SystemUserResponse>> {
    return this.get<SystemUserResponse>(`${this.BASE_PATH}/me`);
  }

  static async createSystemUser(data: CreateSystemUserDto): Promise<ApiResponse<SystemUserResponse>> {
    return this.post<SystemUserResponse>(this.BASE_PATH, data);
  }

  static async updateSystemUser(id: string, data: UpdateSystemUserDto): Promise<ApiResponse<SystemUserResponse>> {
    return this.patch<SystemUserResponse>(`${this.BASE_PATH}/${id}`, data);
  }

  static async deleteSystemUser(id: string): Promise<ApiResponse<SystemUserResponse>> {
    return this.delete<SystemUserResponse>(`${this.BASE_PATH}/${id}`);
  }

  // Auth endpoints
  static async login(email: string, password: string): Promise<ApiResponse<SystemUserLoginResponse>> {
    const response = await this.post<SystemUserLoginResponse>('/auth/system/login', { email, password });

    if (response.data) {
      // Store token and user data
      Cookies.set('token', response.data.access_token, { 
        sameSite: 'lax',
        secure: window.location.protocol === 'https:',
        path: '/'
      });
      Cookies.set('userType', 'system', { 
        sameSite: 'lax',
        secure: window.location.protocol === 'https:',
        path: '/'
      });
      
      // Fetch latest user data including organizations
      const userResponse = await this.getCurrentUser();
      if (userResponse.data) {
        localStorage.setItem('user', JSON.stringify(userResponse.data));
      }
    }

    return response;
  }

  static async register(data: CreateSystemUserDto): Promise<ApiResponse<SystemUserLoginResponse>> {
    const response = await this.post<SystemUserLoginResponse>('/auth/system/register', data);

    if (response.data) {
      // Store token and user data
      Cookies.set('token', response.data.access_token, { 
        sameSite: 'lax',
        secure: window.location.protocol === 'https:',
        path: '/'
      });
      Cookies.set('userType', 'system', { 
        sameSite: 'lax',
        secure: window.location.protocol === 'https:',
        path: '/'
      });
      
      // Fetch latest user data including organizations
      const userResponse = await this.getCurrentUser();
      if (userResponse.data) {
        localStorage.setItem('user', JSON.stringify(userResponse.data));
      }
    }

    return response;
  }

  static logout(): void {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('userType', { path: '/' });
    localStorage.removeItem('user');
  }

  static isAuthenticated(): boolean {
    return !!Cookies.get('token') && Cookies.get('userType') === 'system';
  }

  static getUser(): SystemUserResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static async refreshUserData(): Promise<void> {
    if (this.isAuthenticated()) {
      const response = await this.getCurrentUser();
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    }
  }
}
