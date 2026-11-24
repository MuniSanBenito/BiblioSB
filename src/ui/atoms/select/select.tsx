// Select uncontrolled; onChange opcional para forms que envían al cambiar.
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
  defaultValue?: string
  onChange?: ChangeEventHandler<HTMLSelectElement>
  ariaLabel?: string
}

export function Select({ id, name, options, defaultValue, onChange, ariaLabel }: SelectProps) {
  return (
    <select
      className={styles.select}
      id={id}
      name={name}
      defaultValue={defaultValue}
      aria-label={ariaLabel}
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
