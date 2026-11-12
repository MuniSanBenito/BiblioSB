// Datos de la sesión, sin presentación.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/panel/")({
  head: () => ({
    meta: [
      {
        title: "Inicio | Panel · Biblioteca municipal de San Benito",
      },
    ],
  }),
  component: PanelHome,
});

function PanelHome() {
  const { email, name, role, uid } = Route.useRouteContext();

  return (
    <article>
      <h1>Inicio</h1>
      <dl>
        <dt>Correo</dt>
        <dd>{email}</dd>
        <dt>Nombre</dt>
        <dd>{name}</dd>
        <dt>Rol</dt>
        <dd>{role}</dd>
        <dt>Uid</dt>
        <dd>{uid}</dd>
      </dl>
    </article>
  );
}
