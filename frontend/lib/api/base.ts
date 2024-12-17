import Cookies from 'js-cookie';
import type { ApiResponse, ApiError, EmptyResponse } from '../../types/api';

export abstract class BaseApi {
  protected static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';  // Updated port to 5000

  protected static async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    console.log(`[API Response] ${response.url}:`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const error: ApiError = {
        message: 'An error occurred',
        status: response.status,
      };

      try {
        const data = await response.json();
        console.error(`[API Error Response] ${response.url}:`, data);
        error.message = data.message || error.message;
      } catch (parseError) {
        console.error(`[API Parse Error] ${response.url}:`, parseError);
      }

      throw error;
    }

    if (response.status === 204) {
      return { data: { success: true } as unknown as T };
    }

    try {
      const rawData = await response.json();
      console.log(`[API Success Response] ${response.url}:`, rawData);
      
      // The backend wraps responses in a data property
      if (rawData && typeof rawData === 'object' && 'data' in rawData) {
        return { data: rawData.data as T };
      }
      
      // Fallback to returning the raw data if it's not wrapped
      return { data: rawData as T };
    } catch (parseError) {
      console.error(`[API Parse Error] ${response.url}:`, parseError);
      throw new Error('Failed to parse response data');
    }
  }

  protected static getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',  // Added Accept header
    };

    const token = Cookies.get('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('[API Headers]:', headers);
    return headers;
  }

  protected static async request<T>(
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${this.baseUrl}/${cleanEndpoint}`;
    
    console.log(`[API Request] ${method} ${url}`, { data });

    try {
      const response = await fetch(url, {
        method,
        headers: this.getHeaders(),
        credentials: 'include',
        body: data ? JSON.stringify(data) : undefined,
      });

      const result = await this.handleResponse<T>(response);
      console.log(`[API Result] ${method} ${url}:`, result);
      return result;
    } catch (error) {
      console.error(`[API Error] ${method} ${url}:`, error);
      if (error instanceof Error && error.message.includes('401')) {
        // Log more details about auth-related errors
        console.error('Auth Error Details:', {
          token: Cookies.get('token'),
          headers: this.getHeaders(),
        });
      }
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  }

  protected static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    console.log(`[API GET] Initiating request to: ${endpoint}`);
    return this.request<T>('GET', endpoint);
  }

  protected static async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    console.log(`[API POST] Initiating request to: ${endpoint}`, { data });
    return this.request<T>('POST', endpoint, data);
  }

  protected static async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    console.log(`[API PUT] Initiating request to: ${endpoint}`, { data });
    return this.request<T>('PUT', endpoint, data);
  }

  protected static async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    console.log(`[API PATCH] Initiating request to: ${endpoint}`, { data });
    return this.request<T>('PATCH', endpoint, data);
  }

  protected static async delete<T = EmptyResponse>(endpoint: string): Promise<ApiResponse<T>> {
    console.log(`[API DELETE] Initiating request to: ${endpoint}`);
    return this.request<T>('DELETE', endpoint);
  }
}
