'use client'

// Aviso flotante. El kind distingue éxito, error e info (color + anuncio).
import { createPortal } from 'react-dom'
import styles from './toast.module.css'

export type ToastKind = 'ok' | 'error' | 'info'

type ToastProps = {
  message: string
  kind?: ToastKind
  onClose: () => void
}

const KIND_LABEL: Record<ToastKind, string> = {
  ok: 'Éxito',
  error: 'Error',
  info: 'Aviso',
}

export function Toast({ message, kind = 'error', onClose }: ToastProps) {
  if (typeof document === 'undefined') {
    return null
  }

  // Error: alert (urgente). Éxito/aviso: status (sin interrumpir).
  const role = kind === 'error' ? 'alert' : 'status'

  return createPortal(
    <div className={`${styles.toast} ${styles[kind]}`}>
      {/* El live region va solo en el texto: no debe contener controles focusables. */}
      <p className={styles.message} role={role}>
        <span className="visually-hidden">{KIND_LABEL[kind]}. </span>
        {message}
      </p>
      <button type="button" className={styles.close} onClick={onClose}>
        Cerrar
      </button>
    </div>,
    document.body,
  )
}
