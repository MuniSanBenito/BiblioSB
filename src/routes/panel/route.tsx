import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/panel")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
