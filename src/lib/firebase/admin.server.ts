// Admin SDK solo en el servidor. La clave sale de .env y no se escribe en el código.
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const {
  FIREBASE_ADMIN_PRIVATE_KEY,
  FIREBASE_ADMIN_PROJECT_ID,
  FIREBASE_ADMIN_CLIENT_EMAIL,
} = process.env;

const privateKey = FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!FIREBASE_ADMIN_PROJECT_ID || !FIREBASE_ADMIN_CLIENT_EMAIL || !privateKey) {
  throw new Error(
    "Faltan FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL o FIREBASE_ADMIN_PRIVATE_KEY.",
  );
}

// Vite puede recargar el módulo. Si la app ya existe, se reutiliza.
export const firebaseAdmin =
  getApps()[0] ??
  initializeApp({
    projectId: FIREBASE_ADMIN_PROJECT_ID,
    credential: cert({
      projectId: FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });

export const adminAuth = getAuth(firebaseAdmin);
