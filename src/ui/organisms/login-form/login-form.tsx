// Formulario de ingreso. Traduce los errores de Firebase a una frase concreta.
import { Button } from "#/ui/atoms/button/button";
import { PasswordField } from "#/ui/molecules/password-field/password-field";
import { TextField } from "#/ui/molecules/text-field/text-field";
import { Toast } from "#/ui/molecules/toast/toast";
import { FirebaseError } from "firebase/app";
import { useState, type SubmitEvent } from "react";
import styles from "./login-form.module.css";

const errorId = "login-error";

type LoginFormProps = {
  onSubmit: (email: string, password: string) => Promise<void>;
};

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setError("");
    setPending(true);
    try {
      await onSubmit(email, password);
    } catch (caught) {
      setError(messageForAuthError(caught));
      setPending(false);
    }
  }

  function clearError(update: (value: string) => void) {
    return (value: string) => {
      if (error) setError("");
      update(value);
    };
  }

  return (
    <form
      className={styles.form}
      id="ingresar"
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
        ariaInvalid={Boolean(error)}
        ariaDescribedBy={error ? errorId : undefined}
      />
      <PasswordField
        value={password}
        onChange={clearError(setPassword)}
        ariaInvalid={Boolean(error)}
        ariaDescribedBy={error ? errorId : undefined}
      />
      {error ? <Toast id={errorId} message={error} onClose={() => setError("")} /> : null}
      <Button disabled={pending}>{pending ? "Ingresando" : "Ingresar"}</Button>
    </form>
  );
}

function messageForAuthError(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return "No se pudo ingresar. Volvé a intentar.";
  }

  if (error.code === "auth/invalid-email") {
    return "El correo no tiene un formato válido.";
  }

  if (error.code === "auth/too-many-requests") {
    return "Demasiados intentos. Esperá un momento y volvé a intentar.";
  }

  if (error.code === "auth/user-disabled") {
    return "Esta cuenta está deshabilitada. Consultá en la biblioteca.";
  }

  if (error.code === "auth/network-request-failed") {
    return "No hay conexión. Revisá la red y volvé a intentar.";
  }

  if (
    error.code === "auth/invalid-credential" ||
    error.code === "auth/wrong-password" ||
    error.code === "auth/user-not-found" ||
    error.code === "auth/invalid-login-credentials"
  ) {
    return "El correo o la contraseña no coinciden.";
  }

  return "No se pudo ingresar. Volvé a intentar.";
}
