// Listado y gestión de ciudadanos (contribuyentes). Solo personal autorizado.
import { getCiudadanos } from "#/lib/contribuyentes/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/panel/ciudadanos/")({
  ssr: false,
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
  loader: async () => {
    // cargar ciudadanos desde la API
    try {
      const ciudadanos = await getCiudadanos();
      return ciudadanos;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  component: CiudadanosPage,
});

function CiudadanosPage() {
  const data = Route.useLoaderData();

  console.log(data);

  return (
    <article>
      <h1>Ciudadanos</h1>
      <p>Acá vas a poder buscar y gestionar contribuyentes.</p>
    </article>
  );
}
