// El panel es solo para admin y bibliotecaria. Sin rol, vuelve al ingreso.
import { readStaffRole } from "#/lib/firebase/role";
import { waitForAuthUser } from "#/lib/firebase/wait-for-auth-user";
import { PanelLayout } from "#/ui/templates/panel-layout/panel-layout";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/panel")({
  ssr: false,
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
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

    return {
      email: user.email,
      name: user.displayName,
      uid: user.uid,
      role,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PanelLayout>
      <Outlet />
    </PanelLayout>
  );
}
