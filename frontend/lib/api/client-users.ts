import { BaseApi } from './base';
import type { ApiResponse, EmptyResponse } from '../../types/api';
import type { 
  ClientUserResponse, 
  CreateClientUserDto, 
  UpdateClientUserDto 
} from '../../types/users';

export class ClientUsersApi extends BaseApi {
  static async getAll(organizationId: string): Promise<ApiResponse<ClientUserResponse[]>> {
    console.log('[ClientUsers API] Fetching all client users', { 
      organizationId,
      endpoint: `/organizations/${organizationId}/client-users`
    });

    const response = await this.get<ClientUserResponse[]>(`/organizations/${organizationId}/client-users`);
    
    console.log('[ClientUsers API] GetAll response', {
      success: !response.error,
      error: response.error,
      userCount: response.data?.length,
      data: response.data
    });

    return response;
  }

  static async getById(organizationId: string, id: string): Promise<ApiResponse<ClientUserResponse>> {
    console.log('[ClientUsers API] Fetching client user by ID', { 
      organizationId, 
      userId: id,
      endpoint: `/organizations/${organizationId}/client-users/${id}`
    });

    const response = await this.get<ClientUserResponse>(`/organizations/${organizationId}/client-users/${id}`);
    
    console.log('[ClientUsers API] GetById response', {
      success: !response.error,
      error: response.error,
      userId: response.data?.id,
      data: response.data
    });

    return response;
  }

  static async create(organizationId: string, data: CreateClientUserDto): Promise<ApiResponse<ClientUserResponse>> {
    console.log('[ClientUsers API] Creating client user', { 
      organizationId,
      userData: { ...data, password: '[REDACTED]' },
      endpoint: `/organizations/${organizationId}/client-users`
    });

    const response = await this.post<ClientUserResponse>(`/organizations/${organizationId}/client-users`, data);
    
    console.log('[ClientUsers API] Create response', {
      success: !response.error,
      error: response.error,
      newUserId: response.data?.id,
      data: response.data ? { ...response.data, password: '[REDACTED]' } : null
    });

    return response;
  }

  static async update(organizationId: string, id: string, data: UpdateClientUserDto): Promise<ApiResponse<ClientUserResponse>> {
    console.log('[ClientUsers API] Updating client user', { 
      organizationId,
      userId: id,
      updateData: data.password ? { ...data, password: '[REDACTED]' } : data,
      endpoint: `/organizations/${organizationId}/client-users/${id}`
    });

    const response = await this.put<ClientUserResponse>(`/organizations/${organizationId}/client-users/${id}`, data);
    
    console.log('[ClientUsers API] Update response', {
      success: !response.error,
      error: response.error,
      userId: response.data?.id,
      data: response.data
    });

    return response;
  }

  static async deleteUser(organizationId: string, id: string): Promise<ApiResponse<EmptyResponse>> {
    console.log('[ClientUsers API] Deleting client user', { 
      organizationId,
      userId: id,
      endpoint: `/organizations/${organizationId}/client-users/${id}`
    });

    const response = await this.delete<EmptyResponse>(`/organizations/${organizationId}/client-users/${id}`);
    
    console.log('[ClientUsers API] Delete response', {
      success: !response.error,
      error: response.error,
      data: response.data
    });

    return response;
  }
}
