// Marco de la pantalla: banda lima con el cerro del escudo y el formulario debajo.
import type { ReactNode } from "react";
import styles from "./login-page.module.css";

type LoginPageProps = {
  children: ReactNode;
};

export function LoginPage({ children }: LoginPageProps) {
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
      <main className={styles.main}>{children}</main>
      <p className={styles.note}>Municipalidad de San Benito</p>
    </div>
  );
}
