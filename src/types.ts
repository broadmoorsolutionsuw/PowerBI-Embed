// src/types/index.ts

// Configuration
export interface PowerBIConfig {
  authorityUrl: string;
  tenantId: string;
  clientId: string;
  clientSecret: string;
  scopeBase: string;
}

// API Request Types
export interface EmbedTokenRequest {
  username: string;
  datasetIds: string[];
  roles?: string[];
}

export interface GenerateTokenRequest {
  reports: PowerBIReport[];
  datasets: PowerBIDataset[];
  targetWorkspaces?: PowerBIWorkspace[];
  identities?: PowerBIIdentity[];
}

// Power BI Resource Types
interface PowerBIIdentity {
  username: string;
  roles: string[];
  datasets: string[];
}

interface PowerBIReport {
  id: string;
}

interface PowerBIDataset {
  id: string;
}

interface PowerBIWorkspace {
  id: string;
}

// API Response Types
export interface ReportDetail {
  reportId: string;
  reportName: string;
  embedUrl: string;
}

export interface EmbedTokenResponse {
  accessToken: string;
  embedUrl: ReportDetail[];
  expiry: string;
  status: number;
}

// Internal API Types
export interface PowerBIWorkspaceInfo {
  id: string;
  name: string;
  isReadOnly: boolean;
  isOnDedicatedCapacity: boolean;
  capacityId?: string;
  description?: string;
  type: string;
  state: string;
}

export interface PowerBIReportInfo {
  id: string;
  name: string;
  datasetId: string;
  description?: string;
  embedUrl: string;
  webUrl: string;
  reportType: string;
}

// Error Types
export interface PowerBIErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export interface ServiceErrorResponse {
  error: string;
  details?: string;
  status: number;
}


export interface PowerBIUser {
  emailAddress: string;
  groupUserAccessRight: string;
  displayName: string;
  identifier: string;
  principalType: string;
}

export interface PowerBIWorkspaceInfo {
  id: string;
  name: string;
  type: string;
  state: string;
  isOnDedicatedCapacity: boolean;
  isOrphaned: boolean;
  isReadOnly: boolean;
  users: PowerBIUser[];
  capacityId?: string;
  description?: string;
  dataflowStorageId?: string;
  defaultDatasetStorageFormat?: string;
  workspaceProperties?: {
    [key: string]: string;
  };
}
