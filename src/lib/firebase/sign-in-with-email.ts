// Inicia sesión con el correo y la contraseña de Firebase Auth.
import { auth } from "#/lib/firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";

export async function signInWithEmail(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password);
}
