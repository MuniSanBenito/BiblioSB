'use client'

// Abre o cierra la barra lateral en pantallas chicas.
import type { Ref } from 'react'
import styles from './menu-button.module.css'

type MenuButtonProps = {
  ref?: Ref<HTMLButtonElement>
  open: boolean
  controls: string
  onClick: () => void
}

export function MenuButton({ ref, open, controls, onClick }: MenuButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      className={styles.button}
      aria-expanded={open}
      aria-controls={controls}
      onClick={onClick}
    >
      {open ? 'Cerrar' : 'Menú'}
    </button>
  )
}
