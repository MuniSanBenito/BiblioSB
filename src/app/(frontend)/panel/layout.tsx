import { PanelUserProvider } from '@/context/panel-user-context'
import { payload } from '@/lib/payload/server'
import { PanelLayout } from '@/ui/templates/panel-layout/panel-layout'
import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import type { PropsWithChildren } from 'react'

export default async function Layout({ children }: PropsWithChildren) {
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    redirect('/', RedirectType.replace)
  }

  return (
    <PanelUserProvider user={user}>
      <PanelLayout>{children}</PanelLayout>
    </PanelUserProvider>
  )
}
