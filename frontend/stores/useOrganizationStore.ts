import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Organization, UserOrganization, ServiceProvider } from '../types/organizations'
import { System } from '../types/systems'
import { StateCreator } from 'zustand'
import { OrganizationsApi } from '../lib/api/organizations'

export interface OrganizationState {
  // State
  currentOrganization: Organization | null;
  userRole: UserOrganization | null;
  systems: System[];
  users: UserOrganization[];
  clientOrgs: Organization[];
  providerOrgs: ServiceProvider[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentOrganization: (org: Organization | null) => void;
  setUserRole: (role: UserOrganization | null) => void;
  setSystems: (systems: System[]) => void;
  setUsers: (users: UserOrganization[]) => void;
  setClientOrgs: (clients: Organization[]) => void;
  setProviderOrgs: (providers: ServiceProvider[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Async Actions
  fetchOrganization: (orgId: string) => Promise<void>;
  fetchSystems: (orgId: string) => Promise<void>;
  fetchUsers: (orgId: string) => Promise<void>;
  fetchClients: (orgId: string) => Promise<void>;
  fetchProviders: (orgId: string) => Promise<void>;
}

const createOrganizationStore: StateCreator<OrganizationState> = (set) => ({
  // State
  currentOrganization: null,
  userRole: null,
  systems: [],
  users: [],
  clientOrgs: [],
  providerOrgs: [],
  isLoading: false,
  error: null,

  // Actions
  setCurrentOrganization: (org: Organization | null) => set({ currentOrganization: org }),
  setUserRole: (role: UserOrganization | null) => set({ userRole: role }),
  setSystems: (systems: System[]) => set({ systems }),
  setUsers: (users: UserOrganization[]) => set({ users }),
  setClientOrgs: (clients: Organization[]) => set({ clientOrgs: clients }),
  setProviderOrgs: (providers: ServiceProvider[]) => set({ providerOrgs: providers }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),

  // Async Actions
  fetchOrganization: async (orgId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await OrganizationsApi.getById(orgId)
      if (response.error) {
        throw new Error(response.error)
      }
      if (!response.data) {
        throw new Error('Invalid response format')
      }
      set({ currentOrganization: response.data })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchSystems: async (orgId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await OrganizationsApi.getSystems(orgId)
      if (response.error) {
        throw new Error(response.error)
      }
      if (!response.data?.data) {
        throw new Error('Invalid response format')
      }
      set({ systems: response.data.data })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchUsers: async (orgId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await OrganizationsApi.getUsers(orgId)
      if (response.error) {
        throw new Error(response.error)
      }
      if (!response.data?.data) {
        throw new Error('Invalid response format')
      }
      set({ users: response.data.data })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchClients: async (orgId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await OrganizationsApi.getClients(orgId)
      if (response.error) {
        throw new Error(response.error)
      }
      if (!response.data?.data) {
        throw new Error('Invalid response format')
      }
      set({ clientOrgs: response.data.data })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchProviders: async (orgId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await OrganizationsApi.getProviders(orgId)
      if (response.error) {
        throw new Error(response.error)
      }
      if (!response.data?.data) {
        throw new Error('Invalid response format')
      }
      set({ providerOrgs: response.data.data })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      set({ isLoading: false })
    }
  },
})

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    createOrganizationStore,
    {
      name: 'organization-storage',
      partialize: (state) => ({
        currentOrganization: state.currentOrganization,
        userRole: state.userRole,
        systems: state.systems,
        users: state.users,
        clientOrgs: state.clientOrgs,
        providerOrgs: state.providerOrgs,
      }),
    }
  )
)
