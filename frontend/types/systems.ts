import type { ATOPackage } from './ato';
import type { Organization } from './organizations';

// Base Types
export interface System {
  id: string;
  name: string;
  description: string;
  type: SystemType;
  status: SystemStatus;
  organizationId: string;
  organization?: Organization;
  createdAt: string;
  updatedAt: string;
  atoPackages?: ATOPackage[];
}

// DTOs
export interface CreateSystemDto {
  name: string;
  description: string;
  organizationId: string;
  type: SystemType;
}

export interface UpdateSystemDto {
  name?: string;
  description?: string;
  type?: SystemType;
  status?: SystemStatus;
}

// Enums
export enum SystemStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export enum SystemType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
  CLOUD = 'CLOUD',
  ON_PREMISE = 'ON_PREMISE',
  HYBRID = 'HYBRID'
}

// Response Types
export interface SystemsResponse {
  systems: System[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SystemResponse {
  system: System;
}
