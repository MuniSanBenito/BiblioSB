// Acción de toolbar (Buscar, Limpiar, etc.). El texto lo define quien lo usa.
import type { ReactNode } from 'react'
import styles from './toolbar-button.module.css'

type ToolbarButtonProps = {
  children: ReactNode
  type?: 'submit' | 'button'
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export function ToolbarButton({
  children,
  type = 'submit',
  variant = 'primary',
  disabled = false,
}: ToolbarButtonProps) {
  return (
    <button
      className={variant === 'secondary' ? styles.secondary : styles.button}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
