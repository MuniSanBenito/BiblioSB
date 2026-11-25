'use client'

// Formulario de edición de un contribuyente. Guarda vía Server Action.
import {
  updateCiudadano,
  type CiudadanoEditData,
} from '@/app/(frontend)/panel/ciudadanos/[id]/actions'
import { Button } from '@/ui/atoms/button/button'
import { SelectField } from '@/ui/molecules/select-field/select-field'
import { TextField } from '@/ui/molecules/text-field/text-field'
import { Toast } from '@/ui/molecules/toast/toast'
import { useState, useTransition, type SubmitEvent } from 'react'
import styles from './ciudadano-edit-form.module.css'

const TIPO_DOCUMENTO_OPTIONS = [
  { value: '', label: 'Sin especificar' },
  { value: '80', label: 'CUIT' },
  { value: '89', label: 'LE' },
  { value: '90', label: 'LC' },
  { value: '96', label: 'DNI' },
]

const SEXO_OPTIONS = [
  { value: '0', label: 'No informado' },
  { value: '1', label: 'Masculino' },
  { value: '2', label: 'Femenino' },
]

type CiudadanoEditFormProps = {
  id: string
  initial: CiudadanoEditData
}

function toInput(value: string | number | null | undefined) {
  if (value === null || value === undefined) return ''
  return String(value)
}

// date input espera YYYY-MM-DD; la API puede traer ISO completo.
function toDateInput(value: string | null | undefined) {
  if (!value) return ''
  return value.slice(0, 10)
}

export function CiudadanoEditForm({ id, initial }: CiudadanoEditFormProps) {
  const [nombre, setNombre] = useState(toInput(initial.nombre))
  const [domicilio, setDomicilio] = useState(toInput(initial.domicilio))
  const [tipoDocumento, setTipoDocumento] = useState(toInput(initial.tipo_documento))
  const [numeroDocumento, setNumeroDocumento] = useState(toInput(initial.numero_documento))
  const [cuit, setCuit] = useState(toInput(initial.cuit))
  const [email, setEmail] = useState(toInput(initial.email))
  const [domicilioAltura, setDomicilioAltura] = useState(toInput(initial.domicilio_altura))
  const [domicilioCalleSecundaria, setDomicilioCalleSecundaria] = useState(
    toInput(initial.domicilio_calle_secundaria),
  )
  const [domicilioTorre, setDomicilioTorre] = useState(toInput(initial.domicilio_torre))
  const [domicilioPiso, setDomicilioPiso] = useState(toInput(initial.domicilio_piso))
  const [domicilioDepto, setDomicilioDepto] = useState(toInput(initial.domicilio_depto))
  const [sexo, setSexo] = useState(
    toInput(initial.sexo === null || initial.sexo === undefined ? 0 : initial.sexo),
  )
  const [nacionalidad, setNacionalidad] = useState(toInput(initial.nacionalidad))
  const [fechaNacimiento, setFechaNacimiento] = useState(toDateInput(initial.fecha_nacimiento))
  const [emailSecundario, setEmailSecundario] = useState(toInput(initial.email_secundario))
  const [telefonoWeb, setTelefonoWeb] = useState(toInput(initial.telefono_web))
  const [telefonoSecundario, setTelefonoSecundario] = useState(toInput(initial.telefono_secundario))

  const [toast, setToast] = useState<{ kind: 'ok' | 'error'; message: string } | null>(null)
  const [pending, startTransition] = useTransition()

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (pending) return

    const form = event.currentTarget
    if (!form.reportValidity()) return

    setToast(null)

    const payload: Record<string, string> = {
      nombre,
      domicilio,
      tipo_documento: tipoDocumento,
      numero_documento: numeroDocumento,
      cuit,
      email,
      domicilio_altura: domicilioAltura,
      domicilio_calle_secundaria: domicilioCalleSecundaria,
      domicilio_torre: domicilioTorre,
      domicilio_piso: domicilioPiso,
      domicilio_depto: domicilioDepto,
      sexo,
      nacionalidad,
      fecha_nacimiento: fechaNacimiento,
      email_secundario: emailSecundario,
      telefono_web: telefonoWeb,
      telefono_secundario: telefonoSecundario,
    }

    startTransition(async () => {
      const result = await updateCiudadano(id, payload)

      if (result.ok) {
        setToast({ kind: 'ok', message: 'Cambios guardados.' })
        return
      }

      setToast({ kind: 'error', message: result.message })
    })
  }

  return (
    <form
      className={styles.form}
      id="editar-ciudadano"
      method="post"
      aria-labelledby="editar-ciudadano-titulo"
      aria-busy={pending}
      onSubmit={handleSubmit}
    >
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Identidad</legend>
        <TextField
          id="nombre"
          label="Nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          value={nombre}
          onChange={setNombre}
          required
          enterKeyHint="next"
        />
        <SelectField
          id="tipo_documento"
          label="Tipo de documento"
          name="tipo_documento"
          options={TIPO_DOCUMENTO_OPTIONS}
          value={tipoDocumento}
          onChange={setTipoDocumento}
        />
        <TextField
          id="numero_documento"
          label="Número de documento"
          name="numero_documento"
          type="text"
          autoComplete="off"
          value={numeroDocumento}
          onChange={setNumeroDocumento}
          enterKeyHint="next"
          spellCheck={false}
          autoCapitalize="off"
        />
        <TextField
          id="cuit"
          label="CUIT / CUIL"
          name="cuit"
          type="text"
          autoComplete="off"
          value={cuit}
          onChange={setCuit}
          enterKeyHint="next"
          inputMode="numeric"
          spellCheck={false}
          autoCapitalize="off"
        />
        <SelectField
          id="sexo"
          label="Sexo"
          name="sexo"
          options={SEXO_OPTIONS}
          value={sexo}
          onChange={setSexo}
        />
        <TextField
          id="nacionalidad"
          label="Nacionalidad"
          name="nacionalidad"
          type="text"
          autoComplete="country-name"
          value={nacionalidad}
          onChange={setNacionalidad}
          enterKeyHint="next"
        />
        <TextField
          id="fecha_nacimiento"
          label="Fecha de nacimiento"
          name="fecha_nacimiento"
          type="date"
          autoComplete="bday"
          value={fechaNacimiento}
          onChange={setFechaNacimiento}
          enterKeyHint="next"
        />
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Domicilio</legend>
        <TextField
          id="domicilio"
          label="Domicilio"
          name="domicilio"
          type="text"
          autoComplete="street-address"
          value={domicilio}
          onChange={setDomicilio}
          enterKeyHint="next"
        />
        <TextField
          id="domicilio_altura"
          label="Altura"
          name="domicilio_altura"
          type="text"
          autoComplete="off"
          value={domicilioAltura}
          onChange={setDomicilioAltura}
          enterKeyHint="next"
        />
        <TextField
          id="domicilio_calle_secundaria"
          label="Entre calle"
          name="domicilio_calle_secundaria"
          type="text"
          autoComplete="off"
          value={domicilioCalleSecundaria}
          onChange={setDomicilioCalleSecundaria}
          enterKeyHint="next"
        />
        <TextField
          id="domicilio_torre"
          label="Torre"
          name="domicilio_torre"
          type="text"
          autoComplete="off"
          value={domicilioTorre}
          onChange={setDomicilioTorre}
          enterKeyHint="next"
        />
        <TextField
          id="domicilio_piso"
          label="Piso"
          name="domicilio_piso"
          type="text"
          autoComplete="address-level4"
          value={domicilioPiso}
          onChange={setDomicilioPiso}
          enterKeyHint="next"
        />
        <TextField
          id="domicilio_depto"
          label="Departamento"
          name="domicilio_depto"
          type="text"
          autoComplete="off"
          value={domicilioDepto}
          onChange={setDomicilioDepto}
          enterKeyHint="next"
        />
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Contacto</legend>
        <TextField
          id="email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          enterKeyHint="next"
          spellCheck={false}
          autoCapitalize="off"
          errorId="email-error"
          errorMessage="Ingresá un email válido, por ejemplo vos@ejemplo.com."
        />
        <TextField
          id="email_secundario"
          label="Email secundario"
          name="email_secundario"
          type="email"
          autoComplete="email"
          value={emailSecundario}
          onChange={setEmailSecundario}
          enterKeyHint="next"
          spellCheck={false}
          autoCapitalize="off"
          errorId="email-secundario-error"
          errorMessage="Ingresá un email válido, por ejemplo vos@ejemplo.com."
        />
        <TextField
          id="telefono_web"
          label="Teléfono"
          name="telefono_web"
          type="tel"
          autoComplete="tel"
          value={telefonoWeb}
          onChange={setTelefonoWeb}
          enterKeyHint="next"
          inputMode="tel"
        />
        <TextField
          id="telefono_secundario"
          label="Teléfono secundario"
          name="telefono_secundario"
          type="tel"
          autoComplete="tel"
          value={telefonoSecundario}
          onChange={setTelefonoSecundario}
          enterKeyHint="done"
          inputMode="tel"
        />
      </fieldset>

      <Button disabled={pending}>{pending ? 'Guardando' : 'Guardar cambios'}</Button>

      {toast ? <Toast message={toast.message} onClose={() => setToast(null)} /> : null}
    </form>
  )
}
