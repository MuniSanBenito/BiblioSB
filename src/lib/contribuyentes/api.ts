// Server function de contribuyentes: el bundler de Start arma el RPC en cliente y el handler en servidor.
import { adminAuth } from "#/lib/firebase/admin.server";
import { isStaffRole } from "#/lib/firebase/role";
import { waitForAuthUser } from "#/lib/firebase/wait-for-auth-user";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { sdk } from "../payload/sdk.server";

// Solo para getCiudadanos: envía el JWT en cliente y lo verifica con Admin en servidor.
const getCiudadanosStaffMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const user = await waitForAuthUser();
    if (!user) {
      throw new Error("No autorizado");
    }

    const token = await user.getIdToken();
    return next({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  })
  .server(async ({ next }) => {
    const authorization = getRequestHeader("Authorization");
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length)
      : null;

    if (!token) {
      throw new Error("No autorizado");
    }

    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(token);
    } catch {
      throw new Error("No autorizado");
    }

    if (!isStaffRole(decoded.role)) {
      throw new Error("Sin permiso");
    }

    return next();
  });

export const getCiudadanos = createServerFn({ method: "GET" })
  .middleware([getCiudadanosStaffMiddleware])
  .handler(async () => {
    try {
      const r = await sdk.find({
        collection: "contribuyentes",
      });

      return r;
    } catch (error) {
      console.error(error);
      return null;
    }
  });
