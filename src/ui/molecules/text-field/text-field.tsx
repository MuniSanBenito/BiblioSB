'use client'

// Etiqueta visible arriba del campo. El placeholder no reemplaza a la etiqueta.
import { TextInput } from '@/ui/atoms/text-input/text-input'
import styles from './text-field.module.css'

type TextFieldProps = {
  id: string
  label: string
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
  errorId?: string
  errorMessage?: string
}

export function TextField({
  id,
  label,
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
  errorId,
  errorMessage,
}: TextFieldProps) {
  // Asterisco solo visual; required ya lo anuncia el control nativo.
  const labelText = required ? (
    <>
      {label} <span aria-hidden="true">*</span>
    </>
  ) : (
    label
  )

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {labelText}
      </label>
      <TextInput
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        required={required}
        enterKeyHint={enterKeyHint}
        inputMode={inputMode}
        spellCheck={spellCheck}
        autoCapitalize={autoCapitalize}
        ariaInvalid={ariaInvalid}
        ariaDescribedBy={ariaDescribedBy}
      />
      {errorId && errorMessage ? (
        <p id={errorId} className={styles.error}>
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
