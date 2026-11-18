'use client'

import type { User } from '@/payload-types'
import { createContext, useContext, type ReactNode } from 'react'

const PanelUserContext = createContext<User | null>(null)

export function PanelUserProvider({ user, children }: { user: User; children: ReactNode }) {
  return <PanelUserContext.Provider value={user}>{children}</PanelUserContext.Provider>
}

export function usePanelUser(): User {
  const user = useContext(PanelUserContext)

  if (!user) {
    throw new Error('usePanelUser debe usarse dentro de PanelUserProvider')
  }

  return user
}
