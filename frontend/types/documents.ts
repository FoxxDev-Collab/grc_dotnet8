// Base Types
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

// DTOs
export interface CreateDocumentDto {
  name: string;
  type: DocumentType;
  url: string;
  controlId?: string;
  atoPackageId?: string;
}

export interface UpdateDocumentDto {
  name?: string;
  type?: DocumentType;
  url?: string;
}

// Enums
export enum DocumentType {
  POLICY = 'POLICY',
  PROCEDURE = 'PROCEDURE',
  EVIDENCE = 'EVIDENCE',
  ASSESSMENT = 'ASSESSMENT',
  SCAN_RESULT = 'SCAN_RESULT',
  REPORT = 'REPORT'
}

// Response Types
export interface DocumentsResponse {
  documents: Document[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DocumentResponse {
  document: Document;
}
