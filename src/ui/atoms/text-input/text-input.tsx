'use client'

// Campo de texto nativo. La etiqueta vive en la molécula que lo usa.
import styles from './text-input.module.css'

type TextInputProps = {
  id: string
  name: string
  type: 'email' | 'password' | 'text' | 'tel' | 'date'
  autoComplete: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  enterKeyHint?: 'next' | 'done'
  inputMode?: 'text' | 'email' | 'tel' | 'numeric'
  spellCheck?: boolean
  autoCapitalize?: 'off'
  ariaInvalid?: boolean
  ariaDescribedBy?: string
}

export function TextInput({
  id,
  name,
  type,
  autoComplete,
  value,
  onChange,
  required,
  enterKeyHint,
  inputMode,
  spellCheck,
  autoCapitalize,
  ariaInvalid,
  ariaDescribedBy,
}: TextInputProps) {
  return (
    <input
      className={styles.input}
      id={id}
      name={name}
      type={type}
      autoComplete={autoComplete}
      value={value}
      required={required}
      enterKeyHint={enterKeyHint}
      inputMode={inputMode}
      spellCheck={spellCheck}
      autoCapitalize={autoCapitalize}
      aria-invalid={ariaInvalid || undefined}
      aria-describedby={ariaDescribedBy}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}
