import { create } from 'zustand'
import { ClientRole } from '@/types/enums'

interface ClientUserStore {
  isClientUser: boolean
  clientRole?: ClientRole
  setIsClientUser: (isClientUser: boolean) => void
  setClientRole: (role?: ClientRole) => void
  isAdmin: () => boolean
}

export const useClientUser = create<ClientUserStore>((set, get) => ({
  isClientUser: false,
  clientRole: undefined,
  setIsClientUser: (isClientUser: boolean) => set({ isClientUser }),
  setClientRole: (role?: ClientRole) => set({ clientRole: role }),
  isAdmin: () => get().clientRole === ClientRole.ADMIN,
}))
