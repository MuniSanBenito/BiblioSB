// Form GET: Buscar escribe q (+ page=1); Limpiar siempre visible (disabled sin q).
import { SearchInput } from '@/ui/atoms/search-input/search-input'
import { ToolbarButton } from '@/ui/atoms/toolbar-button/toolbar-button'
import Link from 'next/link'
import styles from './ciudadanos-search-form.module.css'

type CiudadanosSearchFormProps = {
  q: string
  page: number
  limit: number
  sort: string
  order: string
}

function clearHref(page: number, limit: number, sort: string, order: string) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  params.set('sort', sort)
  params.set('order', order)
  return `/panel/ciudadanos?${params.toString()}`
}

export function CiudadanosSearchForm({ q, page, limit, sort, order }: CiudadanosSearchFormProps) {
  const hintId = 'ciudadanos-search-hint'
  const inputId = 'ciudadanos-q'
  const canClear = Boolean(q)

  return (
    <form className={styles.form} method="get" action="/panel/ciudadanos">
      {/* Nueva búsqueda siempre vuelve a la primera página. */}
      <input type="hidden" name="page" value="1" />
      <input type="hidden" name="limit" value={String(limit)} />
      <input type="hidden" name="sort" value={sort} />
      <input type="hidden" name="order" value={order} />
      <label className={styles.label} htmlFor={inputId}>
        Buscar ciudadanos
      </label>
      <div className={styles.row}>
        <div className={styles.field}>
          <SearchInput id={inputId} name="q" defaultValue={q} ariaDescribedBy={hintId} />
        </div>
        <p id={hintId} className={styles.hint}>
          Busca por número de documento, nombre o email.
        </p>
        <div className={styles.actions}>
          <ToolbarButton type="submit">Buscar</ToolbarButton>
          {canClear ? (
            <Link className={styles.clear} href={clearHref(page, limit, sort, order)}>
              Limpiar
            </Link>
          ) : (
            <button className={styles.clear} type="button" disabled aria-disabled="true">
              Limpiar
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
