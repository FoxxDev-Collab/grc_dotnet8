// Base Types
export interface Asset {
  id: string;
  name: string;
  description: string;
  systemId: string;
  type: AssetType;
  status: AssetStatus;
  createdAt: string;
  updatedAt: string;
  portMappings?: PortMapping[];
}

export interface PortMapping {
  id: string;
  assetId: string;
  port: number;
  protocol: string;
  service: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// DTOs
export interface CreateAssetDto {
  name: string;
  description: string;
  systemId: string;
  type: AssetType;
}

export interface UpdateAssetDto {
  name?: string;
  description?: string;
  type?: AssetType;
  status?: AssetStatus;
}

// Enums
export enum AssetType {
  SERVER = 'SERVER',
  DATABASE = 'DATABASE',
  NETWORK_DEVICE = 'NETWORK_DEVICE',
  APPLICATION = 'APPLICATION',
  STORAGE = 'STORAGE',
  ENDPOINT = 'ENDPOINT',
  IOT_DEVICE = 'IOT_DEVICE',
  OTHER = 'OTHER'
}

export enum AssetStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  DECOMMISSIONED = 'DECOMMISSIONED'
}

// Response Types
export interface AssetsResponse {
  assets: Asset[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AssetResponse {
  asset: Asset;
}
