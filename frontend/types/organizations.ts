import type { System } from './systems';
import type { SystemUserResponse, ClientUserResponse } from './users';

// Risk-related interfaces
export interface RiskProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  businessFunctions: string;
  keyAssets: string;
  complianceFrameworks: string[];
  dataTypes: string[];
  operationalRisk: RiskLevel;
  dataSecurityRisk: RiskLevel;
  complianceRisk: RiskLevel;
  financialRisk: RiskLevel;
}

export interface RiskMatrixEntry {
  impact: number;
  likelihood: number;
  value: number;
}

export interface MitigationPriority {
  risk: string;
  priority: number;
  strategy: string;
  timeline: string;
  timeframe: TimeFrame;
  riskArea: string;
  successCriteria: string;
  resources: string;
  estimatedCost: string;
  responsibleParty: string;
}

// Base Types
export interface BaseOrganization {
  id: string;
  name: string;
  type: OrgType;
  description?: string;
  isActive: boolean;
  isServiceProvider: boolean;
  primaryContact?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  riskProfile?: RiskProfile;
  riskMatrix?: RiskMatrixEntry[];
  mitigationPriorities?: MitigationPriority[];
}

// Organization Types
export interface ServiceProvider extends BaseOrganization {
  type: OrgType.SERVICE_PROVIDER;
  clientOrganizations: ClientOrganization[];
}

export interface ClientOrganization extends BaseOrganization {
  type: OrgType.CLIENT;
  serviceProviderId: string;
  systems: System[];
}

export type Organization = ServiceProvider | ClientOrganization;

// DTOs
export interface CreateOrganizationDto {
  name: string;
  type: OrgType;
  description?: string;
  isActive?: boolean;
  isServiceProvider?: boolean;
  primaryContact?: string;
  email?: string;
  phone?: string;
  address?: string;
  riskProfile?: CreateRiskProfileDto;
  quantitativeRisks?: CreateQuantitativeRiskDto[];
  riskMatrix?: CreateRiskMatrixEntryDto[];
  mitigationPriorities?: CreateMitigationPriorityDto[];
}

export interface UpdateOrganizationDto {
  name?: string;
  type?: OrgType;
  description?: string;
  isActive?: boolean;
  isServiceProvider?: boolean;
  primaryContact?: string;
  email?: string;
  phone?: string;
  address?: string;
  riskProfile?: UpdateRiskProfileDto;
  quantitativeRisks?: CreateQuantitativeRiskDto[];
  riskMatrix?: CreateRiskMatrixEntryDto[];
  mitigationPriorities?: CreateMitigationPriorityDto[];
}

export interface AddUserToOrganizationDto {
  userId: string;
  role: OrganizationRole;
}

// Risk Profile DTOs
export interface CreateRiskProfileDto {
  businessFunctions: string;
  keyAssets: string;
  complianceFrameworks: string[];
  dataTypes: string[];
  operationalRisk: RiskLevel;
  dataSecurityRisk: RiskLevel;
  complianceRisk: RiskLevel;
  financialRisk: RiskLevel;
}

export interface UpdateRiskProfileDto extends CreateRiskProfileDto {
  id?: string;
}

export interface CreateQuantitativeRiskDto {
  annualLoss: number;
  probabilityOfOccurrence: number;
  impactScore: number;
  riskScore: number;
}

export interface CreateRiskMatrixEntryDto {
  impact: number;
  likelihood: number;
  value: number;
}

export interface CreateMitigationPriorityDto {
  risk: string;
  priority: number;
  strategy: string;
  timeline: string;
  timeframe: TimeFrame;
  riskArea: string;
  successCriteria: string;
  resources: string;
  estimatedCost: string;
  responsibleParty: string;
}

// Enums
export enum OrgType {
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  CLIENT = 'CLIENT'
}

export enum OrganizationRole {
  AODR = 'AODR',
  SCA = 'SCA',
  SCAR = 'SCAR',
  AUDITOR = 'AUDITOR',
  ISSM = 'ISSM',
  ISSO = 'ISSO'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum TimeFrame {
  IMMEDIATE = 'IMMEDIATE',
  SHORT_TERM = 'SHORT_TERM',
  MEDIUM_TERM = 'MEDIUM_TERM',
  LONG_TERM = 'LONG_TERM'
}

// Relationships
export interface UserOrganization {
  id: string;
  organizationId: string;
  systemUser?: SystemUserResponse;
  clientUser?: ClientUserResponse;
  organization?: Organization;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
