// Campo search nativo sin estado React; el valor sale por el form GET.
import styles from './search-input.module.css'

type SearchInputProps = {
  id: string
  name: string
  defaultValue?: string
  ariaDescribedBy?: string
}

export function SearchInput({ id, name, defaultValue = '', ariaDescribedBy }: SearchInputProps) {
  return (
    <input
      className={styles.input}
      id={id}
      name={name}
      type="search"
      defaultValue={defaultValue}
      enterKeyHint="search"
      spellCheck={false}
      autoCapitalize="off"
      autoComplete="off"
      aria-describedby={ariaDescribedBy}
    />
  )
}
