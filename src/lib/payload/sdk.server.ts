// *.server.ts se ejecuta en el servidor y no en el cliente y puede usar secretos
import { PayloadSDK } from "@payloadcms/sdk";

export const sdk = new PayloadSDK({
  baseURL: process.env.EXTERNAL_API_BASE_URL,
  baseInit: {
    headers: {
      "Content-Type": "application/json",
      token: process.env.EXTERNAL_API_KEY,
    },
  },
});
