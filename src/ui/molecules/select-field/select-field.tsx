'use client'

// Etiqueta visible + select. Un valor string; las opciones las define quien lo usa.
import { Select } from '@/ui/atoms/select/select'
import styles from './select-field.module.css'

type SelectOption = {
  value: string
  label: string
}

type SelectFieldProps = {
  id: string
  label: string
  name: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  required?: boolean
  ariaInvalid?: boolean
  ariaDescribedBy?: string
}

export function SelectField({
  id,
  label,
  name,
  options,
  value,
  onChange,
  required,
  ariaInvalid,
  ariaDescribedBy,
}: SelectFieldProps) {
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
      <Select
        id={id}
        name={name}
        options={options}
        value={value}
        required={required}
        ariaInvalid={ariaInvalid}
        ariaDescribedBy={ariaDescribedBy}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
