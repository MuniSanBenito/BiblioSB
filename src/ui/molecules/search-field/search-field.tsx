// Label + search uncontrolled para forms GET con searchParams.
import { SearchInput } from '@/ui/atoms/search-input/search-input'
import styles from './search-field.module.css'

type SearchFieldProps = {
  id: string
  label: string
  name: string
  defaultValue?: string
  ariaDescribedBy?: string
}

export function SearchField({ id, label, name, defaultValue, ariaDescribedBy }: SearchFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <SearchInput
        id={id}
        name={name}
        defaultValue={defaultValue}
        ariaDescribedBy={ariaDescribedBy}
      />
    </div>
  )
}
