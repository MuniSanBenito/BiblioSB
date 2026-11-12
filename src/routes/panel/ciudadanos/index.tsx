// Listado y gestión de ciudadanos (contribuyentes). Solo personal autorizado.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/panel/ciudadanos/")({
  head: () => ({
    meta: [
      {
        title: "Ciudadanos | Panel · Biblioteca municipal de San Benito",
      },
      {
        name: "description",
        content:
          "Consulta y administración de ciudadanos registrados en la biblioteca municipal de San Benito.",
      },
    ],
  }),
  component: CiudadanosPage,
});

function CiudadanosPage() {
  return (
    <article>
      <h1>Ciudadanos</h1>
      <p>Acá vas a poder buscar y gestionar contribuyentes.</p>
    </article>
  );
}
