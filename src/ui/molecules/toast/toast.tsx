'use client'

// Aviso flotante. Se anuncia al lector de pantalla y no empuja el contenido.
import { createPortal } from 'react-dom'
import styles from './toast.module.css'

type ToastProps = {
  id?: string
  message: string
  onClose: () => void
}

export function Toast({ id, message, onClose }: ToastProps) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <div id={id} className={styles.toast} role="alert">
      <p className={styles.message}>{message}</p>
      <button type="button" className={styles.close} onClick={onClose}>
        Cerrar
      </button>
    </div>,
    document.body,
  )
}
