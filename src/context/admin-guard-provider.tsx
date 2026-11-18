import { redirect, RedirectType } from 'next/navigation'
import type { ServerProps } from 'payload'
import type { PropsWithChildren } from 'react'

export function AdminGuardProvider({ user, children }: ServerProps & PropsWithChildren) {
  if (!user) {
    redirect('/login', RedirectType.replace)
  }

  if (!user.dev) {
    redirect('/panel', RedirectType.replace)
  }

  return children
}
