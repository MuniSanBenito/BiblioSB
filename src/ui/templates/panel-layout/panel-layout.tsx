'use client'

// Cascarón del panel: menú a la izquierda y ruta arriba. El contenido lo pone la ruta.
import { MenuButton } from '@/ui/atoms/menu-button/menu-button'
import { Breadcrumb } from '@/ui/molecules/breadcrumb/breadcrumb'
import { panelMenuId, SideNav } from '@/ui/organisms/side-nav/side-nav'
import { useSelectedLayoutSegments } from 'next/navigation'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './panel-layout.module.css'

// Solo rutas con pantalla propia; el padre /panel no va en la miga.
const crumbByRouteId: Record<string, { label: string; to?: '/panel' }> = {
  '/panel/': { label: 'Inicio', to: '/panel' },
  '/panel/ciudadanos/': { label: 'Ciudadanos' },
}

type PanelLayoutProps = {
  children: ReactNode
}

export function PanelLayout({ children }: PanelLayoutProps) {
  const [open, setOpen] = useState(false)
  const wide = useWideScreen()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const segments = useSelectedLayoutSegments()
  const menuHidden = !wide && !open

  const crumbs = segments.flatMap((segment) => {
    const config = crumbByRouteId[segment]

    if (!config) {
      return []
    }

    return [{ label: config.label, to: config.to }]
  })

  useEffect(() => {
    if (!open || wide) return

    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setOpen(false)
      menuButtonRef.current?.focus()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, wide])

  function closeMenu() {
    setOpen(false)
  }

  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#contenido">
        Saltar al contenido
      </a>
      {open && !wide ? (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Cerrar menú"
          onClick={closeMenu}
        />
      ) : null}
      <div className={menuHidden ? styles.asideHidden : styles.aside}>
        <SideNav hidden={menuHidden} onNavigate={closeMenu} />
      </div>
      <div className={styles.workspace}>
        <header className={styles.top}>
          <MenuButton
            ref={menuButtonRef}
            open={open}
            controls={panelMenuId}
            onClick={() => setOpen((value) => !value)}
          />
          <Breadcrumb items={crumbs} />
        </header>
        {/* tabIndex -1: el enlace "Saltar al contenido" puede mover el foco acá. */}
        <main id="contenido" tabIndex={-1} className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  )
}

function useWideScreen() {
  // Inicializamos en false para evitar ReferenceError en SSR y hydration mismatch
  const [wide, setWide] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 48rem)')
    const update = () => setWide(query.matches)

    update() // Sincroniza el estado real al montar en el cliente
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return wide
}
