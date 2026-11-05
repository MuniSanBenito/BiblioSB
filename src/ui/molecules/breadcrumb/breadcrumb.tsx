// Ruta de la pantalla. El último paso es la página actual y no es un enlace.
import { Link } from "@tanstack/react-router";
import styles from "./breadcrumb.module.css";

type Crumb = {
  label: string;
  to?: "/panel";
};

type BreadcrumbProps = {
  items: Crumb[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className={styles.nav} aria-label="Ruta">
      <ol className={styles.list}>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li className={styles.item} key={item.label}>
              {current || !item.to ? (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link className={styles.link} to={item.to}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
