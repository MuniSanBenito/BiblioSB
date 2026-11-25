'use server'

// Actualiza un contribuyente vía API externa; auth local en cada llamada.
import type { Contribuyente } from '@/data/contribuyente'
import { globalSdk } from '@/lib/payload/global-sdk'
import { payload } from '@/lib/payload/server'
import { PayloadSDKError } from '@payloadcms/sdk'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export type CiudadanoEditData = Pick<
  Contribuyente,
  | 'nombre'
  | 'domicilio'
  | 'tipo_documento'
  | 'numero_documento'
  | 'cuit'
  | 'email'
  | 'domicilio_altura'
  | 'domicilio_calle_secundaria'
  | 'domicilio_torre'
  | 'domicilio_piso'
  | 'domicilio_depto'
  | 'sexo'
  | 'nacionalidad'
  | 'fecha_nacimiento'
  | 'email_secundario'
  | 'telefono_web'
  | 'telefono_secundario'
>

export type UpdateCiudadanoResult = { ok: true } | { ok: false; message: string }

function emptyToNull(value: string): string | null {
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

function parseOptionalInt(value: string): number | null {
  const trimmed = value.trim()

  if (trimmed === '') {
    return null
  }

  const n = Number(trimmed)
  return Number.isFinite(n) ? n : null
}

export async function updateCiudadano(
  id: string,
  raw: Record<string, string>,
): Promise<UpdateCiudadanoResult> {
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    return { ok: false, message: 'Tenés que iniciar sesión para guardar.' }
  }

  if (!id) {
    return { ok: false, message: 'Falta el identificador del ciudadano.' }
  }

  const data: CiudadanoEditData = {
    nombre: emptyToNull(raw.nombre ?? ''),
    domicilio: emptyToNull(raw.domicilio ?? ''),
    tipo_documento: parseOptionalInt(raw.tipo_documento ?? ''),
    numero_documento: emptyToNull(raw.numero_documento ?? ''),
    cuit: emptyToNull(raw.cuit ?? ''),
    email: emptyToNull(raw.email ?? ''),
    domicilio_altura: emptyToNull(raw.domicilio_altura ?? ''),
    domicilio_calle_secundaria: emptyToNull(raw.domicilio_calle_secundaria ?? ''),
    domicilio_torre: emptyToNull(raw.domicilio_torre ?? ''),
    domicilio_piso: emptyToNull(raw.domicilio_piso ?? ''),
    domicilio_depto: emptyToNull(raw.domicilio_depto ?? ''),
    sexo: parseOptionalInt(raw.sexo ?? ''),
    nacionalidad: emptyToNull(raw.nacionalidad ?? ''),
    fecha_nacimiento: emptyToNull(raw.fecha_nacimiento ?? ''),
    email_secundario: emptyToNull(raw.email_secundario ?? ''),
    telefono_web: emptyToNull(raw.telefono_web ?? ''),
    telefono_secundario: emptyToNull(raw.telefono_secundario ?? ''),
  }

  try {
    await globalSdk.update({
      collection: 'contribuyentes',
      id,
      data,
    })
  } catch (error) {
    console.error(error)

    if (error instanceof TypeError) {
      return { ok: false, message: 'No hay conexión. Revisá la red y volvé a intentar.' }
    }

    if (error instanceof PayloadSDKError) {
      return { ok: false, message: 'No se pudo guardar. Volvé a intentar.' }
    }

    return { ok: false, message: 'No se pudo guardar. Volvé a intentar.' }
  }

  revalidatePath('/panel/ciudadanos')
  revalidatePath(`/panel/ciudadanos/${id}`)

  return { ok: true }
}
