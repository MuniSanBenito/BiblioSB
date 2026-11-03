// Botón de envío. El texto lo define quien lo usa.
import type { ReactNode } from "react";
import styles from "./button.module.css";

type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
};

export function Button({ children, disabled }: ButtonProps) {
  return (
    <button className={styles.button} type="submit" disabled={disabled}>
      {children}
    </button>
  );
}
