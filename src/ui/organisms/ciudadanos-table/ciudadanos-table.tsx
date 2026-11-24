// Tabla de contribuyentes: columnas ordenables vía searchParams.
import type { Contribuyente } from '@/data/contribuyente'
import { DataTable, type DataTableHeader } from '@/ui/molecules/data-table/data-table'
import tableStyles from '@/ui/molecules/data-table/data-table.module.css'

type SortField =
  'nombre' | 'domicilio' | 'tipo_documento' | 'numero_documento' | 'email' | 'telefono_web'

type SortOrder = 'asc' | 'desc'

const COLUMNS: { field: SortField; label: string }[] = [
  { field: 'nombre', label: 'Nombre' },
  { field: 'domicilio', label: 'Domicilio' },
  { field: 'tipo_documento', label: 'Tipo doc.' },
  { field: 'numero_documento', label: 'Nº documento' },
  { field: 'email', label: 'Email' },
  { field: 'telefono_web', label: 'Teléfono' },
]

type CiudadanoRow = Pick<
  Contribuyente,
  'id' | 'nombre' | 'domicilio' | 'tipo_documento' | 'numero_documento' | 'email' | 'telefono_web'
>

type CiudadanosTableProps = {
  docs: CiudadanoRow[]
  q: string
  limit: number
  sort: SortField
  order: SortOrder
}

function cell(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }
  return String(value)
}

// Misma columna togglea; otra columna arranca ASC. Siempre page=1.
function sortHref(field: SortField, q: string, limit: number, sort: SortField, order: SortOrder) {
  const nextOrder: SortOrder = field === sort && order === 'asc' ? 'desc' : 'asc'
  const params = new URLSearchParams()
  params.set('page', '1')
  params.set('limit', String(limit))
  params.set('sort', field)
  params.set('order', nextOrder)
  if (q) params.set('q', q)
  return `/panel/ciudadanos?${params.toString()}`
}

function buildHeaders(
  q: string,
  limit: number,
  sort: SortField,
  order: SortOrder,
): DataTableHeader[] {
  return COLUMNS.map(({ field, label }) => ({
    label,
    href: sortHref(field, q, limit, sort, order),
    ...(field === sort
      ? { ariaSort: (order === 'asc' ? 'ascending' : 'descending') as const }
      : {}),
  }))
}

export function CiudadanosTable({ docs, q, limit, sort, order }: CiudadanosTableProps) {
  const headers = buildHeaders(q, limit, sort, order)

  return (
    <DataTable
      caption="Listado de ciudadanos"
      captionId="ciudadanos-table-caption"
      headers={headers}
      isEmpty={docs.length === 0}
      emptyMessage="No se encontraron ciudadanos con esa búsqueda."
    >
      {docs.map((doc) => (
        <tr key={doc.id} className={tableStyles.tr}>
          <th className={tableStyles.rowHead} scope="row">
            {cell(doc.nombre)}
          </th>
          <td className={tableStyles.td}>{cell(doc.domicilio)}</td>
          <td className={tableStyles.td}>{cell(doc.tipo_documento)}</td>
          <td className={tableStyles.td}>{cell(doc.numero_documento)}</td>
          <td className={tableStyles.td}>{cell(doc.email)}</td>
          <td className={tableStyles.td}>{cell(doc.telefono_web)}</td>
        </tr>
      ))}
    </DataTable>
  )
}
