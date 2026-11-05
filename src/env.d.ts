/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Client-side environment variables
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Server-side environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly FIREBASE_ADMIN_TYPE: string;
      readonly FIREBASE_ADMIN_PROJECT_ID: string;
      readonly FIREBASE_ADMIN_PRIVATE_KEY_ID: string;
      readonly FIREBASE_ADMIN_PRIVATE_KEY: string;
      readonly FIREBASE_ADMIN_CLIENT_EMAIL: string;
      readonly FIREBASE_ADMIN_CLIENT_ID: string;
      readonly FIREBASE_ADMIN_AUTH_URI: string;
      readonly FIREBASE_ADMIN_TOKEN_URI: string;
      readonly FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL: string;
      readonly FIREBASE_ADMIN_CLIENT_X509_CERT_URL: string;
      readonly FIREBASE_ADMIN_UNIVERSE_DOMAIN: string;
    }
  }
}

export {};
