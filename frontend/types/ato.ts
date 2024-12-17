import type { System } from './systems';
import type { Document } from './documents';

// Base Types
export interface ATOPackage {
  id: string;
  name: string;
  systemId: string;
  system?: System;
  status: ATOStatus;
  createdAt: string;
  updatedAt: string;
  controls?: Control[];
  documents?: Document[];
}

export interface Control {
  id: string;
  identifier: string;
  title: string;
  description: string;
  atoPackageId: string;
  atoPackage?: ATOPackage;
  status: ControlStatus;
  implementationStatus: ImplementationStatus;
  documents?: Document[];
  createdAt: string;
  updatedAt: string;
}

// DTOs
export interface CreateATOPackageDto {
  name: string;
  systemId: string;
  status?: ATOStatus;
}

export interface UpdateATOPackageDto {
  name?: string;
  status?: ATOStatus;
}

export interface CreateControlDto {
  identifier: string;
  title: string;
  description: string;
  atoPackageId: string;
  status?: ControlStatus;
  implementationStatus?: ImplementationStatus;
}

export interface UpdateControlDto {
  title?: string;
  description?: string;
  status?: ControlStatus;
  implementationStatus?: ImplementationStatus;
}

// Enums
export enum ATOStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  EXPIRED = 'EXPIRED'
}

export enum ControlStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  IMPLEMENTED = 'IMPLEMENTED',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  PARTIALLY_IMPLEMENTED = 'PARTIALLY_IMPLEMENTED'
}

export enum ImplementationStatus {
  PLANNED = 'PLANNED',
  IMPLEMENTED = 'IMPLEMENTED',
  PARTIALLY_IMPLEMENTED = 'PARTIALLY_IMPLEMENTED',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  NOT_APPLICABLE = 'NOT_APPLICABLE'
}

// Response Types
export interface ATOPackagesResponse {
  atoPackages: ATOPackage[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ATOPackageResponse {
  atoPackage: ATOPackage;
}

export interface ControlsResponse {
  controls: Control[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ControlResponse {
  control: Control;
}
