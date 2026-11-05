// Roles del personal. El valor sale del custom claim, no de un campo que el cliente pueda escribir.
import type { User } from "firebase/auth";

export const staffRoles = ["admin", "bibliotecaria"] as const;

export type StaffRole = (typeof staffRoles)[number];

export function isStaffRole(value: unknown): value is StaffRole {
  return value === "admin" || value === "bibliotecaria";
}

// true fuerza un token nuevo: el claim no aparece en el token que ya tenía la sesión.
export async function readStaffRole(user: User): Promise<StaffRole | null> {
  const token = await user.getIdTokenResult(true);
  return isStaffRole(token.claims.role) ? token.claims.role : null;
}
