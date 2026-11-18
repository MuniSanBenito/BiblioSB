import type { Metadata, Viewport } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'Biblioteca municipal de San Benito',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#b6c544',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="es">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
