'use client'

// Secciones del panel: enlaces principales a la izquierda.
import { NavLink } from '@/ui/atoms/nav-link/nav-link'
import { Toast } from '@/ui/molecules/toast/toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './side-nav.module.css'

export const panelMenuId = 'panel-menu'

type SideNavProps = {
  hidden: boolean
  onNavigate: () => void
}

export function SideNav({ hidden, onNavigate }: SideNavProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function handleSignOut() {
    if (pending) return
    setError('')
    setPending(true)

    try {
      const req = await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (req.ok) {
        router.replace('/')
        router.refresh()
      } else {
        throw new Error('No se pudo cerrar la sesión. Volvé a intentar.')
      }
    } catch (error) {
      console.error(error)
      setError('No se pudo cerrar la sesión. Volvé a intentar.')
      setPending(false)
    }
  }

  return (
    <aside id={panelMenuId} className={styles.aside} hidden={hidden}>
      <div>
        <p className={styles.place}>San Benito</p>
        <p className={styles.service}>Biblioteca municipal</p>
      </div>
      <nav aria-label="Secciones del panel">
        <ul className={styles.list}>
          <li>
            <NavLink
              href="/panel"
              className={styles.link}
              activeProps={{ className: `${styles.link} ${styles.current}` }}
              exact
              onClick={onNavigate}
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              href="/panel/ciudadanos"
              className={styles.link}
              activeProps={{ className: `${styles.link} ${styles.current}` }}
              onClick={onNavigate}
            >
              Ciudadanos
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className={styles.signOut}>
        {error ? <Toast message={error} onClose={() => setError('')} /> : null}
        <button
          type="button"
          className={styles.signOutButton}
          disabled={pending}
          onClick={handleSignOut}
        >
          {pending ? 'Cerrando sesión' : 'Cerrar sesión'}
        </button>
      </div>
    </aside>
  )
}
