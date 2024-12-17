// Organization Types
export interface ServiceProvider {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  clientOrganizations: ClientOrganization[];
}

export interface ClientOrganization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  serviceProviderId: string;
  systems: System[];
}

// System and ATO Types
export interface System {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  atoPackages: ATOPackage[];
}

export interface ATOPackage {
  id: string;
  name: string;
  systemId: string;
  status: ATOStatus;
  createdAt: string;
  updatedAt: string;
  controls: Control[];
  documents: Document[];
}

// Control and Evidence Types
export interface Control {
  id: string;
  identifier: string; // e.g., "AC-1", "AU-2"
  title: string;
  description: string;
  atoPackageId: string;
  status: ControlStatus;
  implementationStatus: ImplementationStatus;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  controlId?: string;
  atoPackageId?: string;
  createdAt: string;
  updatedAt: string;
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

export enum DocumentType {
  POLICY = 'POLICY',
  PROCEDURE = 'PROCEDURE',
  EVIDENCE = 'EVIDENCE',
  ASSESSMENT = 'ASSESSMENT',
  SCAN_RESULT = "SCAN_RESULT",
  REPORT = 'REPORT'
}

// Dashboard Types
export interface DashboardMetrics {
  totalOrganizations: number;
  totalSystems: number;
  activeATOPackages: number;
  pendingAssessments: number;
  implementedControls: number;
  totalControls: number;
}

export interface RecentActivity {
  id: string;
  type: ActivityType;
  description: string;
  entityId: string;
  entityType: EntityType;
  userId: string;
  createdAt: string;
}

export enum ActivityType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED'
}

export enum EntityType {
  ORGANIZATION = 'ORGANIZATION',
  SYSTEM = 'SYSTEM',
  ATO_PACKAGE = 'ATO_PACKAGE',
  CONTROL = 'CONTROL',
  DOCUMENT = 'DOCUMENT'
}
