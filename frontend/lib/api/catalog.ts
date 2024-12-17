import { BaseApi } from './base';
import type { ApiResponse } from '../../types/api';
import type { 
  CatalogDto, 
  GroupDto, 
  PaginationParams, 
  FrameworkDisplay,
  ControlBasicDto,
  CatalogUploadResponse 
} from '../../types/catalog';

interface GroupResponse {
  group: GroupDto;
  controls: ControlBasicDto[];
  totalControls: number;
  hasMore: boolean;
}

export class CatalogApi extends BaseApi {
  static async getAllCatalogs(): Promise<ApiResponse<CatalogDto[]>> {
    console.log('[Catalog API] Fetching all catalogs');
    return await this.get<CatalogDto[]>('/catalogs');
  }

  static async getCatalog(id: string, pagination?: PaginationParams): Promise<ApiResponse<CatalogDto>> {
    console.log('[Catalog API] Fetching catalog by ID', { id, pagination });
    const params = new URLSearchParams();
    if (pagination?.page) {
      params.append('page', pagination.page.toString());
    }
    if (pagination?.limit) {
      params.append('limit', pagination.limit.toString());
    }
    const query = params.toString();
    return await this.get<CatalogDto>(`/catalogs/${id}${query ? `?${query}` : ''}`);
  }

  static async getGroupControls(groupId: string, pagination?: PaginationParams): Promise<ApiResponse<GroupResponse>> {
    console.log('[Catalog API] Fetching group controls', { groupId, pagination });
    const params = new URLSearchParams();
    if (pagination?.page) {
      params.append('page', pagination.page.toString());
    }
    if (pagination?.limit) {
      params.append('limit', pagination.limit.toString());
    }
    const query = params.toString();
    return await this.get<GroupResponse>(`/catalogs/groups/${groupId}${query ? `?${query}` : ''}`);
  }

  static async getCatalogWithFullHierarchy(id: string): Promise<ApiResponse<CatalogDto>> {
    console.log('[Catalog API] Fetching catalog with full hierarchy', { id });
    return await this.get<CatalogDto>(`/catalogs/${id}/full`);
  }

  static async updateCatalog(id: string, catalog: CatalogDto): Promise<ApiResponse<CatalogDto>> {
    console.log('[Catalog API] Updating catalog', { id });
    return await this.put<CatalogDto>(`/catalogs/${id}`, catalog);
  }

  static async uploadCatalog(file: File): Promise<ApiResponse<CatalogUploadResponse>> {
    console.log('[Catalog API] Uploading catalog file', { fileName: file.name });
    
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseUrl}/catalogs/upload`;
    const headers = { ...this.getHeaders() };
    // Remove Content-Type for FormData
    delete (headers as { [key: string]: string })['Content-Type'];

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData,
      });

      return await this.handleResponse<CatalogUploadResponse>(response);
    } catch (error) {
      console.error('[Catalog API] Upload error:', error);
      return { error: error instanceof Error ? error.message : 'Upload failed' };
    }
  }

  static catalogToFramework(catalog: CatalogDto): FrameworkDisplay {
    const totalControls = catalog.groups.reduce(
      (sum, group) => sum + group.controls.length,
      0
    );

    return {
      id: catalog.id,
      title: catalog.title,
      version: catalog.version,
      lastModified: catalog.lastModified,
      description: `Security and Privacy Controls Framework`,
      status: 'active',
      controlFamilies: catalog.groups.length,
      totalControls,
      lastUpdated: catalog.lastModified,
      groups: catalog.groups
    };
  }
}
