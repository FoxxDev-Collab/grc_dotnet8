import { Organization, UserOrganization } from '../types/organizations'
import { System } from '../types/systems'
import { ATOPackage, Control } from '../types/ato'
import { Asset, PortMapping } from '../types/assets'

// Extended types for ATO Packages and Assets
export interface ATOPackageWithControls extends ATOPackage {
  controls: Control[]
}

export interface AssetWithDetails extends Asset {
  portMappings: PortMapping[]
}

export interface OrganizationState {
  currentOrganization: Organization | null
  userRole: UserOrganization | null
  systems: System[]
  users: UserOrganization[]
  clientOrgs: Organization[]
  providerOrgs: Organization[]
  isLoading: boolean
  error: string | null
  
  // Actions
  setCurrentOrganization: (org: Organization | null) => void
  setUserRole: (role: UserOrganization | null) => void
  setSystems: (systems: System[]) => void
  setUsers: (users: UserOrganization[]) => void
  setClientOrgs: (clients: Organization[]) => void
  setProviderOrgs: (providers: Organization[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Async Actions
  fetchOrganization: (orgId: string) => Promise<void>
  fetchSystems: (orgId: string) => Promise<void>
  fetchUsers: (orgId: string) => Promise<void>
  fetchClients: (orgId: string) => Promise<void>
  fetchProviders: (orgId: string) => Promise<void>
}

export interface SystemState {
  currentSystem: System | null
  atoPackages: ATOPackageWithControls[]
  assets: AssetWithDetails[]
  isLoading: boolean
  error: string | null

  // Actions
  setCurrentSystem: (system: System | null) => void
  setATOPackages: (packages: ATOPackageWithControls[]) => void
  setAssets: (assets: AssetWithDetails[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Async Actions
  fetchSystem: (systemId: string) => Promise<void>
  fetchATOPackages: (systemId: string) => Promise<void>
  fetchAssets: (systemId: string) => Promise<void>
}
