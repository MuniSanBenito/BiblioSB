import { globalSdk } from '@/lib/payload/global-sdk'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ciudadanos | Panel · Biblioteca municipal de San Benito',
  description:
    'Consulta y administración de ciudadanos registrados en la biblioteca municipal de San Benito.',
}

export default async function Page() {
  const ciudadanos = await globalSdk.find({
    collection: 'contribuyentes',
  })

  return (
    <article>
      <h1>Ciudadanos</h1>
      <p>Acá vas a poder buscar y gestionar contribuyentes.</p>
    </article>
  )
}
