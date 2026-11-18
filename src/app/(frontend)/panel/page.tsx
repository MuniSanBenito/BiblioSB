'use client'

import { usePanelUser } from '@/context/panel-user-context'

export default function Page() {
  const user = usePanelUser()

  return (
    <article>
      <h1>Inicio</h1>
      <dl>
        <dt>Correo</dt>
        <dd>{user.email}</dd>
        <dt>Nombre</dt>
        <dd>{user.name}</dd>
        <dt>Rol</dt>
        <dd>{user.role}</dd>
        <dt>Uid</dt>
        <dd>{user.id}</dd>
      </dl>
    </article>
  )
}
