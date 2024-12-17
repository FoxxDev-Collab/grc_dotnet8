/* eslint-disable @typescript-eslint/no-empty-object-type */
// Base DTOs
export interface PartDto {
  id: string;
  name: string;
  prose: string;
}

export interface ParameterDto {
  id: string;
  label: string;
}

export interface LinkDto {
  rel: string;
  href: string;
  targetControl?: {
    id: string;
    title: string;
    class: string;
  };
  sourceControl?: {
    id: string;
    title: string;
    class: string;
  };
}

export interface ControlBasicDto {
  id: string;
  title: string;
  class: string;
}

export interface ControlDto extends ControlBasicDto {
  parts?: PartDto[];
  parameters?: ParameterDto[];
  enhancements?: ControlDto[];
  outgoingLinks?: LinkDto[];
  incomingLinks?: LinkDto[];
}

export interface GroupDto {
  id: string;
  title: string;
  class: string;
  controls: ControlBasicDto[];
  totalControls?: number;
  hasMore?: boolean;
}

export interface CatalogDto {
  id: string;
  title: string;
  version: string;
  lastModified: string;
  groups: GroupDto[];
  totalGroups?: number;
  hasMore?: boolean;
}

// Extended types for NIST Framework
export interface Part extends PartDto {
  subParts?: Part[];
}

export interface Parameter extends ParameterDto {
  value?: string;
}

export interface Link extends LinkDto {}

export interface Control extends ControlDto {
  description?: string;
  supplementalGuidance?: string;
  relatedControls?: string[];
  parameters: Parameter[];
  parts: Part[];
  status?: string;
  implementation?: string;
  title: string;
  enhancements?: Control[];
  isEnhancement?: boolean;
  baseControlId?: string;
  outgoingLinks?: Link[];
  incomingLinks?: Link[];
}

export interface Group extends GroupDto {
  controls: Control[];
}

// Framework display interface extends base with additional display properties
export interface FrameworkDisplay extends CatalogDto {
  description?: string;
  controlFamilies?: number;
  totalControls?: number;
  status?: 'draft' | 'published' | 'archived' | 'active';
  lastUpdated: string;
}

// Update types
export interface ControlUpdate {
  id?: string;
  title: string;
  status?: string;
  implementation?: string;
  parameters?: Parameter[];
  parts?: Part[];
  description?: string;
  enhancements?: Control[];
  outgoingLinks?: Link[];
  incomingLinks?: Link[];
}

// Helper Types
export interface FrameworkStats {
  totalControls: number;
  implementedControls: number;
  notImplementedControls: number;
  partiallyImplementedControls: number;
  notApplicableControls: number;
}

export interface ControlStats {
  totalParts: number;
  totalParameters: number;
  implementationStatus: string;
  lastUpdated?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Upload response type
export interface CatalogUploadResponse {
  success: boolean;
  message: string;
  details: {
    duration: number;
    stats: {
      groups: number;
      controls: number;
      parts: number;
      parameters: number;
      enhancements: number;
      links: number;
    };
    catalog: {
      id: string;
      title: string;
      version: string;
    };
  };
}
