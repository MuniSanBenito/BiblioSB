import { payload } from '@/lib/payload/server'
import { LoginForm } from '@/ui/organisms/login-form/login-form'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Ingresar | Biblioteca municipal de San Benito',
  description: 'Ingreso del personal a la biblioteca municipal de San Benito, Entre Ríos.',
  robots: 'index, follow',
}

export default async function HomePage() {
  const { user } = await payload.auth({ headers: await headers() })

  if (user) {
    redirect('/panel', RedirectType.replace)
  }

  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#ingresar">
        Saltar al formulario
      </a>
      <header className={styles.band}>
        <div className={styles.sun} aria-hidden="true" />
        <div className={styles.copy}>
          <p className={styles.place}>San Benito</p>
          <p className={styles.service}>Biblioteca municipal</p>
        </div>
        <div className={styles.hill} aria-hidden="true" />
      </header>
      <main className={styles.main}>
        <LoginForm />
      </main>
      <p className={styles.note}>Municipalidad de San Benito</p>
    </div>
  )
}
