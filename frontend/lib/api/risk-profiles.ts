import { ApiResponse } from '../../types/api';
import { RiskProfile } from '../../types/organizations';
import { BaseApi } from './base';

interface RiskProfileResponse {
  data: RiskProfile;
}

export class RiskProfilesApi extends BaseApi {
  static async update(id: string, data: Partial<RiskProfile>): Promise<ApiResponse<RiskProfileResponse>> {
    console.log('[RiskProfiles API] Updating risk profile', { id, data });
    try {
      const response = await this.patch<RiskProfileResponse>(`/risk-profiles/${id}`, data);
      console.log('[RiskProfiles API] Update response', response);
      return response;
    } catch (error) {
      console.error('[RiskProfiles API] Update failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to update risk profile'
      };
    }
  }

  static async getById(id: string): Promise<ApiResponse<RiskProfileResponse>> {
    console.log('[RiskProfiles API] Fetching risk profile by ID', { id });
    try {
      const response = await this.get<RiskProfileResponse>(`/risk-profiles/${id}`);
      console.log('[RiskProfiles API] GetById response', response);
      return response;
    } catch (error) {
      console.error('[RiskProfiles API] GetById failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch risk profile'
      };
    }
  }
}
