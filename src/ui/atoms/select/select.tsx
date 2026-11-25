// Select nativo; controlled (value) o uncontrolled (defaultValue).
import type { ChangeEventHandler } from 'react'
import styles from './select.module.css'

type SelectOption = {
  value: string
  label: string
}

type SelectProps = {
  id: string
  name: string
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: ChangeEventHandler<HTMLSelectElement>
  required?: boolean
  ariaLabel?: string
  ariaInvalid?: boolean
  ariaDescribedBy?: string
}

export function Select({
  id,
  name,
  options,
  value,
  defaultValue,
  onChange,
  required,
  ariaLabel,
  ariaInvalid,
  ariaDescribedBy,
}: SelectProps) {
  const isControlled = value !== undefined

  return (
    <select
      className={styles.select}
      id={id}
      name={name}
      {...(isControlled ? { value } : { defaultValue })}
      required={required}
      aria-label={ariaLabel}
      aria-invalid={ariaInvalid || undefined}
      aria-describedby={ariaDescribedBy}
      onChange={onChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
