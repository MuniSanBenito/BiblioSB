// Tabla de contribuyentes: solo las columnas pedidas para el listado.
import type { Contribuyente } from '@/data/contribuyente'
import { DataTable } from '@/ui/molecules/data-table/data-table'
import tableStyles from '@/ui/molecules/data-table/data-table.module.css'

const HEADERS = ['Nombre', 'Domicilio', 'Tipo doc.', 'Nº documento', 'Email', 'Teléfono']

type CiudadanoRow = Pick<
  Contribuyente,
  'id' | 'nombre' | 'domicilio' | 'tipo_documento' | 'numero_documento' | 'email' | 'telefono_web'
>

type CiudadanosTableProps = {
  docs: CiudadanoRow[]
}

function cell(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }
  return String(value)
}

export function CiudadanosTable({ docs }: CiudadanosTableProps) {
  return (
    <DataTable
      caption="Listado de ciudadanos"
      captionId="ciudadanos-table-caption"
      headers={HEADERS}
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
