import { auth } from "#/lib/firebase/client";
import { onAuthStateChanged, type User } from "firebase/auth";

/** Resolves once Firebase has restored persisted auth state in the browser. */
export function waitForAuthUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}
