// El panel es solo para admin y bibliotecaria. Sin rol, vuelve al ingreso.
import { readStaffRole } from "#/lib/firebase/role";
import { waitForAuthUser } from "#/lib/firebase/wait-for-auth-user";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/panel")({
  ssr: false,
  beforeLoad: async () => {
    const user = await waitForAuthUser();
    if (!user) {
      throw redirect({
        to: "/",
        replace: true,
      });
    }

    const role = await readStaffRole(user);
    if (!role) {
      throw redirect({
        to: "/",
        replace: true,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
