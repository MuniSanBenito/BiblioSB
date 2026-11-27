// Los soportes separan libros, revistas, cuadernillos y otros formatos.
import type { CollectionConfig } from 'payload'

export const SoportesCollection: CollectionConfig = {
  slug: 'soportes',
  admin: {
    useAsTitle: 'nombre',
    description: 'Lista de formatos físicos disponibles para clasificar cada material.',
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Nombre único del soporte, por ejemplo libro, revista o DVD.',
      },
    },
    {
      name: 'activo',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Permite dejar de ofrecer el soporte sin cambiar materiales que ya lo usan.',
      },
    },
  ],
}
