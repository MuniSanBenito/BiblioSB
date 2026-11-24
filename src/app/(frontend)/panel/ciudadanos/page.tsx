import type { Contribuyente } from '@/data/contribuyente'
import { globalSdk } from '@/lib/payload/global-sdk'
import { CiudadanosSearchForm } from '@/ui/molecules/ciudadanos-search-form/ciudadanos-search-form'
import { PageSizeField } from '@/ui/molecules/page-size-field/page-size-field'
import { PaginationNav } from '@/ui/molecules/pagination-nav/pagination-nav'
import { CiudadanosTable } from '@/ui/organisms/ciudadanos-table/ciudadanos-table'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Ciudadanos | Panel · Biblioteca municipal de San Benito',
  description:
    'Consulta y administración de ciudadanos registrados en la biblioteca municipal de San Benito.',
}

const ALLOWED_LIMITS = new Set([10, 20, 30, 50, 100])

// Campos de columna permitidos para ordenar vía searchParams.
const ALLOWED_SORTS = new Set([
  'nombre',
  'domicilio',
  'tipo_documento',
  'numero_documento',
  'email',
  'telefono_web',
])

type SortField =
  'nombre' | 'domicilio' | 'tipo_documento' | 'numero_documento' | 'email' | 'telefono_web'

type SortOrder = 'asc' | 'desc'

type SearchParams = Promise<{
  q?: string
  page?: string
  limit?: string
  sort?: string
  order?: string
}>

type FindResult = {
  docs: Contribuyente[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

function parseLimit(raw: string | undefined) {
  const value = Number(raw)
  if (ALLOWED_LIMITS.has(value)) return value
  return 10
}

function parsePage(raw: string | undefined) {
  const value = Number(raw)
  if (Number.isInteger(value) && value >= 1) return value
  return 1
}

function parseSort(raw: string | undefined): SortField {
  if (raw && ALLOWED_SORTS.has(raw)) return raw as SortField
  return 'nombre'
}

function parseOrder(raw: string | undefined): SortOrder {
  if (raw === 'desc') return 'desc'
  return 'asc'
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const q = params.q?.trim() ?? ''
  const page = parsePage(params.page)
  const limit = parseLimit(params.limit)
  const sort = parseSort(params.sort)
  const order = parseOrder(params.order)
  // Payload: prefijo "-" = descendente.
  const payloadSort = order === 'desc' ? `-${sort}` : sort

  // where solo si hay texto; contains cubre nombre, documento y email.
  const result = (await globalSdk.find({
    collection: 'contribuyentes',
    page,
    limit,
    sort: payloadSort,
    ...(q
      ? {
          where: {
            or: [
              { nombre: { contains: q } },
              { numero_documento: { contains: q } },
              { email: { contains: q } },
            ],
          },
        }
      : {}),
    select: {
      nombre: true,
      domicilio: true,
      tipo_documento: true,
      numero_documento: true,
      email: true,
      telefono_web: true,
    },
  })) as FindResult

  const currentPage = result.page ?? page

  return (
    <article>
      <h1>Ciudadanos</h1>
      <p>Buscá y consultá contribuyentes registrados en la biblioteca.</p>
      <CiudadanosSearchForm q={q} page={currentPage} limit={limit} sort={sort} order={order} />
      <CiudadanosTable docs={result.docs} q={q} limit={limit} sort={sort} order={order} />
      <div className={styles.footer}>
        <PaginationNav
          q={q}
          page={currentPage}
          limit={limit}
          sort={sort}
          order={order}
          totalPages={result.totalPages ?? 0}
          totalDocs={result.totalDocs ?? 0}
          hasPrevPage={Boolean(result.hasPrevPage)}
          hasNextPage={Boolean(result.hasNextPage)}
        />
        <PageSizeField q={q} limit={limit} sort={sort} order={order} />
      </div>
    </article>
  )
}
