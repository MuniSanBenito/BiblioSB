// Detalle y edición de un contribuyente.
import type { CiudadanoEditData } from '@/app/(frontend)/panel/ciudadanos/[id]/actions'
import { globalSdk } from '@/lib/payload/global-sdk'
import { CiudadanoEditForm } from '@/ui/organisms/ciudadano-edit-form/ciudadano-edit-form'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import styles from './page.module.css'

type PageProps = {
  params: Promise<{ id: string }>
}

const EDIT_SELECT = {
  nombre: true,
  domicilio: true,
  tipo_documento: true,
  numero_documento: true,
  cuit: true,
  email: true,
  domicilio_altura: true,
  domicilio_calle_secundaria: true,
  domicilio_torre: true,
  domicilio_piso: true,
  domicilio_depto: true,
  sexo: true,
  nacionalidad: true,
  fecha_nacimiento: true,
  email_secundario: true,
  telefono_web: true,
  telefono_secundario: true,
} as const

// Dedup entre generateMetadata y la page en el mismo request.
const loadCiudadano = cache(async (id: string) => {
  try {
    return (await globalSdk.findByID({
      collection: 'contribuyentes',
      id,
      select: EDIT_SELECT,
    })) as CiudadanoEditData & { id: string }
  } catch {
    return null
  }
})

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const doc = await loadCiudadano(id)
  const name = doc?.nombre?.trim() || 'Ciudadano'

  return {
    title: `${name} | Panel · Biblioteca municipal de San Benito`,
    description:
      'Detalle y edición de un ciudadano registrado en la biblioteca municipal de San Benito.',
    robots: { index: false, follow: false },
  }
}

export default async function CiudadanoPage({ params }: PageProps) {
  const { id } = await params
  const doc = await loadCiudadano(id)

  if (!doc) {
    notFound()
  }

  const initial: CiudadanoEditData = {
    nombre: doc.nombre,
    domicilio: doc.domicilio,
    tipo_documento: doc.tipo_documento,
    numero_documento: doc.numero_documento,
    cuit: doc.cuit,
    email: doc.email,
    domicilio_altura: doc.domicilio_altura,
    domicilio_calle_secundaria: doc.domicilio_calle_secundaria,
    domicilio_torre: doc.domicilio_torre,
    domicilio_piso: doc.domicilio_piso,
    domicilio_depto: doc.domicilio_depto,
    sexo: doc.sexo,
    nacionalidad: doc.nacionalidad,
    fecha_nacimiento: doc.fecha_nacimiento,
    email_secundario: doc.email_secundario,
    telefono_web: doc.telefono_web,
    telefono_secundario: doc.telefono_secundario,
  }

  return (
    <article className={styles.article}>
      <p className={styles.back}>
        <Link href="/panel/ciudadanos">Volver al listado</Link>
      </p>
      <h1 id="editar-ciudadano-titulo">Editar ciudadano</h1>
      <CiudadanoEditForm id={id} initial={initial} />
    </article>
  )
}
