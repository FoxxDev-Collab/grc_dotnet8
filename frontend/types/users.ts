import { SystemRole } from './enums';
import { ClientRole } from './enums';
import { OrganizationRole } from './enums';

// System User Types
export interface SystemUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: SystemRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: string;
  updatedAt: string;
  type: 'system';  // Added type field
}

export interface CreateSystemUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: SystemRole;
}

export interface UpdateSystemUserDto {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: SystemRole;
  isActive?: boolean;
}

export interface SystemUserLoginResponse {
  access_token: string;
  user: SystemUserResponse;
}

// Client User Types
export interface ClientUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  clientRole: ClientRole;
  organizationRole: OrganizationRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: string;
  updatedAt: string;
  organizations: string[]; // Organization IDs
  type: 'client';  // Added type field
}

export interface CreateClientUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  clientRole: ClientRole;
  organizationRole: OrganizationRole;
  organizationId: string;
}

export interface UpdateClientUserDto {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  clientRole?: ClientRole;
  organizationRole?: OrganizationRole;
  isActive?: boolean;
}

export interface ClientUserLoginResponse {
  access_token: string;
  user: ClientUserResponse;
}

// Auth DTOs
export interface LoginDto {
  email: string;
  password: string;
}

// Common Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
}
