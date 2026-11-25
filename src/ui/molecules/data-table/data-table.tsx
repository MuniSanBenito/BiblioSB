// Cascarón de tabla accesible; las filas las arma el organism que lo usa.
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import styles from './data-table.module.css'

export type DataTableHeader = {
  label: string
  href: string
  // Solo en la columna activa; omitir en el resto.
  ariaSort?: 'ascending' | 'descending'
}

type DataTableProps = {
  caption: string
  captionId: string
  headers: DataTableHeader[]
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
    '--label-1': `"${headers[0]?.label ?? ''}"`,
    '--label-2': `"${headers[1]?.label ?? ''}"`,
    '--label-3': `"${headers[2]?.label ?? ''}"`,
    '--label-4': `"${headers[3]?.label ?? ''}"`,
    '--label-5': `"${headers[4]?.label ?? ''}"`,
    '--label-6': `"${headers[5]?.label ?? ''}"`,
  } as CSSProperties

  return (
    <div className={styles.wrapper} role="region" aria-labelledby={captionId} tabIndex={0}>
      <table className={styles.table} style={labelVars}>
        {/* Solo a11y: nombra la tabla y el region scrolleable. */}
        <caption id={captionId} className="visually-hidden">
          {caption}
        </caption>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            {headers.map((header) => (
              <th
                key={header.label}
                className={styles.th}
                scope="col"
                {...(header.ariaSort ? { 'aria-sort': header.ariaSort } : {})}
              >
                <Link className={styles.sortLink} href={header.href}>
                  <span>{header.label}</span>
                  {/* Decorativo; el estado real está en aria-sort del th. */}
                  <svg
                    className={styles.sortIcon}
                    viewBox="0 0 12 16"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path className={styles.sortUp} d="M6 2 L10 7 H2 Z" />
                    <path className={styles.sortDown} d="M6 14 L2 9 H10 Z" />
                  </svg>
                </Link>
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
