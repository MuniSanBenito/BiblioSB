// Cierra la sesión de Firebase Auth en este dispositivo.
import { auth } from "#/lib/firebase/client";
import { signOut } from "firebase/auth";

export async function signOutStaff() {
  await signOut(auth);
}
