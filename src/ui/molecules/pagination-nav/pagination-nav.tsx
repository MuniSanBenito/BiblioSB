// Links de paginado que preservan q, limit, sort y order vía searchParams.
import Link from 'next/link'
import styles from './pagination-nav.module.css'

type PaginationNavProps = {
  q: string
  page: number
  limit: number
  sort: string
  order: string
  totalPages: number
  totalDocs: number
  hasPrevPage: boolean
  hasNextPage: boolean
}

function pageHref(page: number, limit: number, q: string, sort: string, order: string) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  params.set('sort', sort)
  params.set('order', order)
  if (q) params.set('q', q)
  return `/panel/ciudadanos?${params.toString()}`
}

export function PaginationNav({
  q,
  page,
  limit,
  sort,
  order,
  totalPages,
  totalDocs,
  hasPrevPage,
  hasNextPage,
}: PaginationNavProps) {
  const pagesLabel = totalPages > 0 ? totalPages : 1
  const prevHref = pageHref(page - 1, limit, q, sort, order)
  const nextHref = pageHref(page + 1, limit, q, sort, order)

  return (
    <nav className={styles.nav} aria-label="Paginación de ciudadanos">
      {hasPrevPage ? (
        <Link className={styles.link} href={prevHref}>
          Anterior
        </Link>
      ) : (
        <span className={styles.disabled}>Anterior</span>
      )}
      <p className={styles.status}>
        Página {page} de {pagesLabel} · {totalDocs} resultado
        {totalDocs === 1 ? '' : 's'}
      </p>
      {hasNextPage ? (
        <Link className={styles.link} href={nextHref}>
          Siguiente
        </Link>
      ) : (
        <span className={styles.disabled}>Siguiente</span>
      )}
    </nav>
  )
}
