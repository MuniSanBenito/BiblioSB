'use client'

// Etiqueta visible arriba del campo. El placeholder no reemplaza a la etiqueta.
import { TextInput } from '@/ui/atoms/text-input/text-input'
import styles from './text-field.module.css'

type TextFieldProps = {
  id: string
  label: string
  name: string
  type: 'email' | 'password' | 'text'
  autoComplete: string
  value: string
  onChange: (value: string) => void
  enterKeyHint?: 'next' | 'done'
  spellCheck?: boolean
  autoCapitalize?: 'off'
  ariaInvalid?: boolean
  ariaDescribedBy?: string
}

export function TextField({
  id,
  label,
  name,
  type,
  autoComplete,
  value,
  onChange,
  enterKeyHint,
  spellCheck,
  autoCapitalize,
  ariaInvalid,
  ariaDescribedBy,
}: TextFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <TextInput
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        enterKeyHint={enterKeyHint}
        spellCheck={spellCheck}
        autoCapitalize={autoCapitalize}
        ariaInvalid={ariaInvalid}
        ariaDescribedBy={ariaDescribedBy}
      />
    </div>
  )
}
