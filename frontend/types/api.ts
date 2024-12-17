// Common API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// SingleResponse now matches the backend's response structure
export type SingleResponse<T> = T;

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

// Special response type for void operations
export type EmptyResponse = {
  success: true;
}
