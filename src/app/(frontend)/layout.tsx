import type { Metadata, Viewport } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'Biblioteca municipal de San Benito',
  // Opt-in al escalado de texto del sistema operativo (Chrome/Edge 146+).
  other: { 'text-scale': 'scale' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#b6c544',
}

// Sin landmark propio: cada ruta declara su único <main>.
export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
