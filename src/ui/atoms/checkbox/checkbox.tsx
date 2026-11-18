'use client'

// Casilla nativa con su texto. El objetivo táctil es toda la etiqueta.
import type { ReactNode } from 'react'
import styles from './checkbox.module.css'

type CheckboxProps = {
  id: string
  name: string
  checked: boolean
  onChange: (checked: boolean) => void
  describedBy?: string
  children: ReactNode
}

export function Checkbox({ id, name, checked, onChange, describedBy, children }: CheckboxProps) {
  return (
    <label className={styles.label} htmlFor={id}>
      <input
        className={styles.input}
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{children}</span>
    </label>
  )
}
