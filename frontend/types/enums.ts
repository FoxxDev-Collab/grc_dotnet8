export enum SystemRole {
  GLOBAL_ADMIN = 'GLOBAL_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum ClientRole {
  ADMIN = 'ADMIN',     // Maps to ISSM - Has full administrative control within client org
  MANAGER = 'MANAGER', // Maps to ISSO - Can manage systems but not other users
  PM = 'PM',          // Program Manager - System security governance
  USER = 'USER',       // Basic access to assigned systems
}

export enum OrganizationRole {
  // Service Provider Roles (Foxx Cyber only)
  AODR = 'AODR',      // Authorizing Official Designated Representative
  SCA = 'SCA',        // Security Control Assessor
  SCAR = 'SCAR',      // Security Control Assessor Representative
  AUDITOR = 'AUDITOR', // Audit capabilities across client orgs
  
  // Client Organization Roles
  PM = 'PM',          // Program Manager - System security governance
  ISSM = 'ISSM',      // Information System Security Manager
  ISSO = 'ISSO',      // Information System Security Officer
}

// Role mapping type for type safety when mapping between roles
export type RoleMapping = {
  CLIENT_ADMIN: OrganizationRole.ISSM;    // Full client org management
  CLIENT_MANAGER: OrganizationRole.ISSO;  // System-level management
  CLIENT_PM: OrganizationRole.PM;        // Program management
  CLIENT_USER: undefined;                // Basic user, no special org role
}

// Helper function to map client roles to organization roles
export function mapClientToOrgRole(clientRole: ClientRole): OrganizationRole | undefined {
  const roleMap: Record<ClientRole, OrganizationRole | undefined> = {
    [ClientRole.ADMIN]: OrganizationRole.ISSM,
    [ClientRole.MANAGER]: OrganizationRole.ISSO,
    [ClientRole.PM]: OrganizationRole.PM,
    [ClientRole.USER]: undefined,
  };
  
  return roleMap[clientRole];
}
