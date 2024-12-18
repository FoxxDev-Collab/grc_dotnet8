import { ClientRole } from './enums';

export enum SystemRole {
  GLOBAL_ADMIN = 'GLOBAL_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

// Base interfaces
interface BaseAuthResponse {
  success: boolean;
  access_token: string;
  refresh_token: string;
  errors: string[];
  user: BaseUser;
}

interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  lastLogin: string | null;
}

// System user interfaces
export interface SystemUser extends BaseUser {
  role: SystemRole;
  type: 'system';
}

export interface SystemAuthResponse extends BaseAuthResponse {
  user: SystemUser;
}

export interface SystemLoginRequest {
  email: string;
  password: string;
}

// Client-specific interfaces
export interface ClientUser extends BaseUser {
  organizationId: string;
  organizationName: string;
  organizationType: 'CLIENT' | 'SERVICE_PROVIDER';
  type: 'client';
  clientRole: ClientRole;
  organizationRole?: string;
}

export interface ClientAuthResponse extends BaseAuthResponse {
  user: ClientUser;
}

export interface ClientLoginRequest {
  email: string;
  password: string;
}

// API Response interfaces
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
