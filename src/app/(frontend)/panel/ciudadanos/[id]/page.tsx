// Placeholder de detalle/edición; el contenido llega en un paso siguiente.
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ciudadano | Panel · Biblioteca municipal de San Benito',
  description:
    'Detalle y edición de un ciudadano registrado en la biblioteca municipal de San Benito.',
}

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function CiudadanoPage({ params }: PageProps) {
  // id disponible para el formulario futuro; aún no se usa.
  await params

  return <article />
}
