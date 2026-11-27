// Los idiomas forman una lista administrable para las piezas del catálogo.
import type { CollectionConfig } from 'payload'

export const IdiomasCollection: CollectionConfig = {
  slug: 'idiomas',
  admin: {
    useAsTitle: 'nombre',
    description: 'Lista de idiomas disponibles para clasificar los materiales del catálogo.',
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Nombre único del idioma que se asignará a los materiales.',
      },
    },
    {
      name: 'activo',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Permite dejar de ofrecer el idioma sin cambiar materiales que ya lo usan.',
      },
    },
  ],
}
