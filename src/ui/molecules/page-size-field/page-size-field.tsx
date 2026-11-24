'use client'

// Al cambiar el select, el form GET navega solo (sin estado de React).
import { Select } from '@/ui/atoms/select/select'
import { useRef } from 'react'
import styles from './page-size-field.module.css'

const LIMIT_OPTIONS = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '30', label: '30' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
]

type PageSizeFieldProps = {
  q: string
  limit: number
  sort: string
  order: string
}

export function PageSizeField({ q, limit, sort, order }: PageSizeFieldProps) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form ref={formRef} className={styles.form} method="get" action="/panel/ciudadanos">
      {/* Cambiar el tamaño reinicia a página 1. */}
      <input type="hidden" name="page" value="1" />
      {q ? <input type="hidden" name="q" value={q} /> : null}
      <input type="hidden" name="sort" value={sort} />
      <input type="hidden" name="order" value={order} />
      <label className={styles.label} htmlFor="ciudadanos-limit">
        Mostrar
      </label>
      <div className={styles.selectWrap}>
        <Select
          id="ciudadanos-limit"
          name="limit"
          options={LIMIT_OPTIONS}
          defaultValue={String(limit)}
          ariaLabel="Cantidad de ciudadanos por página"
          onChange={() => formRef.current?.requestSubmit()}
        />
      </div>
    </form>
  )
}
