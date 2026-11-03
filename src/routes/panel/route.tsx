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
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
