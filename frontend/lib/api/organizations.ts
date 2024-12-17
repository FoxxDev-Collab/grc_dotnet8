import { BaseApi } from './base';
import type {
  ApiResponse,
  PaginatedResponse,
  EmptyResponse
} from '../../types/api';
import type {
  Organization,
  ServiceProvider,
  ClientOrganization,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationRole,
  UserOrganization
} from '../../types/organizations';
import type { System } from '../../types/systems';

export class OrganizationsApi extends BaseApi {
  static async create(data: CreateOrganizationDto): Promise<ApiResponse<Organization>> {
    console.log('[Organizations API] Creating organization', data);
    const response = await this.post<Organization>('/organizations', data);
    console.log('[Organizations API] Create response', response);
    return response;
  }

  static async getAll(page = 1, pageSize = 10): Promise<ApiResponse<Organization[]>> {
    console.log('[Organizations API] Fetching all organizations', { page, pageSize });
    const response = await this.get<Organization[]>(`/organizations?page=${page}&pageSize=${pageSize}`);
    console.log('[Organizations API] GetAll response', response);
    return response;
  }

  static async getById(id: string): Promise<ApiResponse<Organization>> {
    console.log('[Organizations API] Fetching organization by ID', { id });
    const response = await this.get<Organization>(`/organizations/${id}`);
    console.log('[Organizations API] GetById response', response);
    return response;
  }

  static async update(id: string, data: UpdateOrganizationDto): Promise<ApiResponse<Organization>> {
    console.log('[Organizations API] Updating organization', { id, data });
    const response = await this.patch<Organization>(`/organizations/${id}`, data);
    console.log('[Organizations API] Update response', response);
    return response;
  }

  static async deleteOrganization(id: string): Promise<ApiResponse<EmptyResponse>> {
    console.log('[Organizations API] Deleting organization', { id });
    const response = await this.delete<EmptyResponse>(`/organizations/${id}`);
    console.log('[Organizations API] Delete response', response);
    return response;
  }

  static async getSystems(id: string, page = 1, pageSize = 10): Promise<ApiResponse<PaginatedResponse<System>>> {
    console.log('[Organizations API] Fetching systems', { id, page, pageSize });
    const response = await this.get<PaginatedResponse<System>>(`/organizations/${id}/systems?page=${page}&pageSize=${pageSize}`);
    console.log('[Organizations API] GetSystems response', response);
    return response;
  }

  static async getUsers(id: string, page = 1, pageSize = 10): Promise<ApiResponse<PaginatedResponse<UserOrganization>>> {
    console.log('[Organizations API] Fetching users', { id, page, pageSize });
    const response = await this.get<PaginatedResponse<UserOrganization>>(`/organizations/${id}/users?page=${page}&pageSize=${pageSize}`);
    console.log('[Organizations API] GetUsers response', response);
    return response;
  }

  static async getClients(id: string, page = 1, pageSize = 10): Promise<ApiResponse<PaginatedResponse<ClientOrganization>>> {
    console.log('[Organizations API] Fetching clients', { id, page, pageSize });
    const response = await this.get<PaginatedResponse<ClientOrganization>>(`/organizations/${id}/clients?page=${page}&pageSize=${pageSize}`);
    console.log('[Organizations API] GetClients response', response);
    return response;
  }

  static async getProviders(id: string, page = 1, pageSize = 10): Promise<ApiResponse<PaginatedResponse<ServiceProvider>>> {
    console.log('[Organizations API] Fetching providers', { id, page, pageSize });
    const response = await this.get<PaginatedResponse<ServiceProvider>>(`/organizations/${id}/providers?page=${page}&pageSize=${pageSize}`);
    console.log('[Organizations API] GetProviders response', response);
    return response;
  }

  static async addUser(organizationId: string, email: string): Promise<ApiResponse<UserOrganization>> {
    console.log('[Organizations API] Adding user to organization', { organizationId, email });
    const response = await this.post<UserOrganization>(`/organizations/${organizationId}/users`, { email });
    console.log('[Organizations API] AddUser response', response);
    return response;
  }

  static async removeUser(organizationId: string, userId: string): Promise<ApiResponse<EmptyResponse>> {
    console.log('[Organizations API] Removing user from organization', { organizationId, userId });
    const response = await this.delete<EmptyResponse>(`/organizations/${organizationId}/users/${userId}`);
    console.log('[Organizations API] RemoveUser response', response);
    return response;
  }

  static async updateUserRole(organizationId: string, userId: string, role: OrganizationRole): Promise<ApiResponse<UserOrganization>> {
    console.log('[Organizations API] Updating user role', { organizationId, userId, role });
    const response = await this.patch<UserOrganization>(`/organizations/${organizationId}/users/${userId}`, { role });
    console.log('[Organizations API] UpdateUserRole response', response);
    return response;
  }
}
