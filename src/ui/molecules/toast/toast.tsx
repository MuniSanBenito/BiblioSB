'use client'

// Aviso flotante. Se anuncia al lector de pantalla y no empuja el contenido.
import { createPortal } from 'react-dom'
import styles from './toast.module.css'

type ToastProps = {
  message: string
  onClose: () => void
}

export function Toast({ message, onClose }: ToastProps) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className={styles.toast}>
      {/* El alert va solo en el texto: no debe contener controles focusables. */}
      <p className={styles.message} role="alert">
        {message}
      </p>
      <button type="button" className={styles.close} onClick={onClose}>
        Cerrar
      </button>
    </div>,
    document.body,
  )
}
