'use client'

// Formulario de ingreso. Traduce los errores de Firebase a una frase concreta.
import { sdk } from '@/lib/payload/sdk'
import { Button } from '@/ui/atoms/button/button'
import { PasswordField } from '@/ui/molecules/password-field/password-field'
import { TextField } from '@/ui/molecules/text-field/text-field'
import { Toast } from '@/ui/molecules/toast/toast'
import { PayloadSDKError } from '@payloadcms/sdk'
import { useRouter } from 'next/navigation'
import { useState, type SubmitEvent } from 'react'
import styles from './login-form.module.css'

export function LoginForm() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (pending) {
      return
    }

    setError('')
    setPending(true)

    try {
      const r = await sdk.login({
        collection: 'users',
        data: {
          email: email,
          password: password,
        },
      })

      if (r.user) {
        router.replace('/panel')
        router.refresh()
        setPending(false)
        setError('')
        return
      }

      setError('El correo o la contraseña no coinciden.')
    } catch (error) {
      console.error(error)
      setError(messageForAuthError(error))
      setPending(false)
    }
  }

  function clearError(update: (value: string) => void) {
    return (value: string) => {
      if (error) {
        setError('')
      }

      update(value)
    }
  }

  return (
    <form
      className={styles.form}
      id="ingresar"
      tabIndex={-1}
      method="post"
      action="/"
      aria-busy={pending}
      onSubmit={handleSubmit}
    >
      <h1 className={styles.title}>Ingresar a la biblioteca</h1>
      <p className={styles.lead}>Usá el correo y la contraseña del personal.</p>
      <TextField
        id="email"
        label="Correo"
        name="email"
        type="email"
        autoComplete="username"
        value={email}
        onChange={clearError(setEmail)}
        enterKeyHint="next"
        spellCheck={false}
        autoCapitalize="off"
      />
      {/* El error es del formulario, no de un campo: se anuncia una sola vez por el Toast. */}
      <PasswordField value={password} onChange={clearError(setPassword)} />
      {error ? <Toast message={error} onClose={() => setError('')} /> : null}
      <Button disabled={pending}>{pending ? 'Ingresando' : 'Ingresar'}</Button>
    </form>
  )
}

function messageForAuthError(error: unknown) {
  // Red caída u otro fallo de fetch
  if (!(error instanceof PayloadSDKError)) {
    if (error instanceof TypeError) {
      return 'No hay conexión. Revisá la red y volvé a intentar.'
    }
    return 'No se pudo ingresar. Volvé a intentar.'
  }

  const msg = error.message

  // LockedAuth (maxLoginAttempts por defecto: 5)
  if (msg.includes('locked') || msg.includes('too many failed login')) {
    return 'Demasiados intentos. Esperá un momento y volvé a intentar.'
  }

  // AuthenticationError
  if (msg.includes('email or password') || msg.includes('incorrect')) {
    return 'El correo o la contraseña no coinciden.'
  }

  return 'No se pudo ingresar. Volvé a intentar.'
}
