// Cascarón de tabla accesible; las filas las arma el organism que lo usa.
import type { CSSProperties, ReactNode } from 'react'
import styles from './data-table.module.css'

type DataTableProps = {
  caption: string
  captionId: string
  headers: string[]
  isEmpty: boolean
  emptyMessage: string
  children: ReactNode
}

export function DataTable({
  caption,
  captionId,
  headers,
  isEmpty,
  emptyMessage,
  children,
}: DataTableProps) {
  // Labels para el layout apilado en contenedor angosto.
  const labelVars = {
    '--label-1': `"${headers[0] ?? ''}"`,
    '--label-2': `"${headers[1] ?? ''}"`,
    '--label-3': `"${headers[2] ?? ''}"`,
    '--label-4': `"${headers[3] ?? ''}"`,
    '--label-5': `"${headers[4] ?? ''}"`,
    '--label-6': `"${headers[5] ?? ''}"`,
  } as CSSProperties

  return (
    <div className={styles.wrapper} role="region" aria-labelledby={captionId} tabIndex={0}>
      <table className={styles.table} style={labelVars}>
        <caption id={captionId} className={styles.caption}>
          {caption}
        </caption>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            {headers.map((header) => (
              <th key={header} className={styles.th} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {isEmpty ? (
            <tr className={styles.tr}>
              <td className={styles.empty} colSpan={headers.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  )
}
