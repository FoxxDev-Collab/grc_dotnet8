import type {
  SystemAuthResponse,
  ClientAuthResponse,
  SystemLoginRequest,
  ClientLoginRequest,
  ApiResponse,
  ApiError,
  SystemUser,
  ClientUser
} from '../types/auth';
import Cookies from 'js-cookie';

export class Api {
  static readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  private static async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error: ApiError = {
        message: 'An error occurred',
        status: response.status,
      };

      try {
        const data = await response.json();
        error.message = data.message || error.message;
      } catch {
        // Use default error message if response is not JSON
      }

      throw error;
    }

    const jsonResponse = await response.json();
    // Handle nested data structure from backend
    return { data: jsonResponse.data };
  }

  private static getHeaders(includeContentType = true): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/json'
    };

    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }

    // Add authorization header if token exists
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
        mode: 'cors'
      });
      return await this.handleResponse<T>(response);
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  }

  static async post<T, D>(endpoint: string, data: D): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(data),
      });
      return await this.handleResponse<T>(response);
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  }

  static async uploadFile<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(false), // Don't include Content-Type for multipart/form-data
        credentials: 'include',
        mode: 'cors',
        body: formData,
      });
      return await this.handleResponse<T>(response);
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  }

  // Profile Method
  static async getProfile(): Promise<ApiResponse<SystemUser | ClientUser>> {
    const userType = this.getUserType();
    const endpoint = userType === 'client' ? '/auth/client/profile' : '/auth/profile';
    return await this.get<SystemUser | ClientUser>(endpoint);
  }

  // System Authentication Methods
  static async systemLogin(data: SystemLoginRequest): Promise<ApiResponse<SystemAuthResponse>> {
    const response = await this.post<SystemAuthResponse, SystemLoginRequest>('/auth/system/login', data);

    if (response.data) {
      // Store token in cookie
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
    }

    return response;
  }

  // Client Authentication Methods
  static async clientLogin(data: ClientLoginRequest): Promise<ApiResponse<ClientAuthResponse>> {
    const response = await this.post<ClientAuthResponse, ClientLoginRequest>('/auth/client/login', data);

    if (response.data) {
      Cookies.set('token', response.data.access_token, { 
        sameSite: 'lax',
        secure: window.location.protocol === 'https:',
        path: '/'
      });
      Cookies.set('userType', 'client', { 
        sameSite: 'lax',
        secure: window.location.protocol === 'https:',
        path: '/'
      });
    }

    return response;
  }

  static logout(): void {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('userType', { path: '/' });
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static getUserType(): 'system' | 'client' | null {
    return (Cookies.get('userType') as 'system' | 'client') || null;
  }

  static getToken(): string | null {
    return Cookies.get('token') || null;
  }
}

export default Api;
