// Los temas se administran por separado y pueden asignarse varios a una pieza.
import type { CollectionConfig } from 'payload'

export const TemasCollection: CollectionConfig = {
  slug: 'temas',
  admin: {
    useAsTitle: 'nombre',
    description:
      'Etiquetas temáticas usadas para clasificar y filtrar los materiales del catálogo.',
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Nombre único del tema que se mostrará al clasificar materiales.',
      },
    },
    {
      name: 'activo',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Permite dejar de ofrecer el tema sin quitarlo de materiales ya clasificados.',
      },
    },
  ],
}
