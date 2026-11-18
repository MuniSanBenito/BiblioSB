'use client'

// Contraseña con una casilla debajo para mostrarla u ocultarla.
import { Checkbox } from '@/ui/atoms/checkbox/checkbox'
import { TextField } from '@/ui/molecules/text-field/text-field'
import { useState } from 'react'
import styles from './password-field.module.css'

const warningId = 'password-visible-warning'

type PasswordFieldProps = {
  value: string
  onChange: (value: string) => void
  ariaInvalid?: boolean
  ariaDescribedBy?: string
}

export function PasswordField({
  value,
  onChange,
  ariaInvalid,
  ariaDescribedBy,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const describedBy = [ariaDescribedBy, visible ? warningId : undefined].filter(Boolean).join(' ')

  return (
    <div className={styles.group}>
      <TextField
        id="password"
        label="Contraseña"
        name="password"
        type={visible ? 'text' : 'password'}
        autoComplete="current-password"
        value={value}
        onChange={onChange}
        enterKeyHint="done"
        spellCheck={false}
        autoCapitalize="off"
        ariaInvalid={ariaInvalid}
        ariaDescribedBy={describedBy || undefined}
      />
      <Checkbox
        id="show-password"
        name="show-password"
        checked={visible}
        onChange={setVisible}
        describedBy={warningId}
      >
        Mostrar contraseña
      </Checkbox>
      <span id={warningId} className="visually-hidden">
        Si la marcás, la contraseña se ve en la pantalla.
      </span>
    </div>
  )
}
