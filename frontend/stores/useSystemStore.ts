import { create } from 'zustand'
import { SystemState, ATOPackageWithControls, AssetWithDetails } from './types'
import { System } from '../types/systems'
import { ATOPackage } from '@/types/ato'
import { Asset } from '@/types/assets'
import { StateCreator } from 'zustand'

const createSystemStore: StateCreator<SystemState> = (set) => ({
  // State
  currentSystem: null,
  atoPackages: [],
  assets: [],
  isLoading: false,
  error: null,

  // Actions
  setCurrentSystem: (system: System | null) => set({ currentSystem: system }),
  setATOPackages: (packages: ATOPackageWithControls[]) => set({ atoPackages: packages }),
  setAssets: (assets: AssetWithDetails[]) => set({ assets }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),

  // Async Actions
  fetchSystem: async (systemId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/systems/${systemId}`)
      if (!response.ok) throw new Error('Failed to fetch system')
      const system = await response.json()
      set({ currentSystem: system })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchATOPackages: async (systemId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/systems/${systemId}/ato-packages`)
      if (!response.ok) throw new Error('Failed to fetch ATO packages')
      const packages: ATOPackage[] = await response.json()
      
      // Transform to ATOPackageWithControls
      const packagesWithControls: ATOPackageWithControls[] = packages.map(pkg => ({
        ...pkg,
        controls: [] // Initialize with empty controls array
      }))
      
      set({ atoPackages: packagesWithControls })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchAssets: async (systemId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/systems/${systemId}/assets`)
      if (!response.ok) throw new Error('Failed to fetch assets')
      const assets: Asset[] = await response.json()
      
      // Transform to AssetWithDetails
      const assetsWithDetails: AssetWithDetails[] = assets.map(asset => ({
        ...asset,
        portMappings: [] // Initialize with empty portMappings array
      }))
      
      set({ assets: assetsWithDetails })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      set({ isLoading: false })
    }
  },
})

export const useSystemStore = create<SystemState>(createSystemStore)
