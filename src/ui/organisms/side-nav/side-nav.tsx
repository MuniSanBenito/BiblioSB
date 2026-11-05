// Secciones del panel. Hoy solo existe Inicio.
import { Link } from "@tanstack/react-router";
import styles from "./side-nav.module.css";

export const panelMenuId = "panel-menu";

type SideNavProps = {
  hidden: boolean;
  onNavigate: () => void;
};

export function SideNav({ hidden, onNavigate }: SideNavProps) {
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
        </ul>
      </nav>
    </aside>
  );
}
