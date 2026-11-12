// Secciones del panel: enlaces principales a la izquierda.
import { signOutStaff } from "#/lib/firebase/sign-out";
import { Toast } from "#/ui/molecules/toast/toast";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import styles from "./side-nav.module.css";

export const panelMenuId = "panel-menu";

type SideNavProps = {
  hidden: boolean;
  onNavigate: () => void;
};

export function SideNav({ hidden, onNavigate }: SideNavProps) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSignOut() {
    if (pending) return;
    setError("");
    setPending(true);
    try {
      await signOutStaff();
      await navigate({ to: "/", replace: true });
    } catch {
      setError("No se pudo cerrar la sesión. Volvé a intentar.");
      setPending(false);
    }
  }

  return (
    <aside id={panelMenuId} className={styles.aside} hidden={hidden}>
      <div>
        <p className={styles.place}>San Benito</p>
        <p className={styles.service}>Biblioteca municipal</p>
      </div>
      <nav aria-label="Secciones del panel">
        <ul className={styles.list}>
          <li>
            <Link
              to="/panel"
              className={styles.link}
              activeProps={{ className: `${styles.link} ${styles.current}` }}
              activeOptions={{ exact: true }}
              onClick={onNavigate}
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/panel/ciudadanos"
              className={styles.link}
              activeProps={{ className: `${styles.link} ${styles.current}` }}
              onClick={onNavigate}
            >
              Ciudadanos
            </Link>
          </li>
        </ul>
      </nav>
      <div className={styles.signOut}>
        {error ? <Toast message={error} onClose={() => setError("")} /> : null}
        <button
          type="button"
          className={styles.signOutButton}
          disabled={pending}
          onClick={handleSignOut}
        >
          {pending ? "Cerrando sesión" : "Cerrar sesión"}
        </button>
      </div>
    </aside>
  );
}
