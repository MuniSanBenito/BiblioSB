// Socios separa la identidad bibliotecaria del ciudadano en la API externa.
import type { CollectionConfig } from 'payload'

export const SociosCollection: CollectionConfig = {
  slug: 'socios',
  admin: {
    useAsTitle: 'apellido',
    description:
      'Personas habilitadas como socios y su vínculo opcional con el padrón externo de ciudadanos.',
  },
  fields: [
    {
      name: 'dni',
      type: 'text',
      index: true,
      admin: {
        description:
          'Documento normalizado, sin puntos ni ceros iniciales. La unicidad parcial queda pendiente para admitir socios legados sin DNI.',
      },
    },
    {
      name: 'numero_socio_legado',
      type: 'number',
      index: true,
      admin: {
        description: 'Identificador interno del socio en el sistema viejo; no es un DNI.',
      },
    },
    {
      name: 'ciudadano_id',
      type: 'text',
      index: true,
      admin: {
        description:
          'Identificador del ciudadano en la instancia externa de Payload, si ya fue vinculado.',
      },
    },
    {
      name: 'origen',
      type: 'select',
      required: true,
      defaultValue: 'nuevo',
      options: [
        { label: 'Legado', value: 'legado' },
        { label: 'Nuevo', value: 'nuevo' },
      ],
      admin: {
        description:
          'Indica si el registro proviene del sistema viejo o fue creado en el sistema nuevo.',
      },
    },
    {
      name: 'apellido',
      type: 'text',
      required: true,
      admin: {
        description:
          'Apellido del socio, conservado en este registro aunque cambie el dato externo.',
      },
    },
    {
      name: 'nombre',
      type: 'text',
      required: true,
      admin: {
        description: 'Nombre del socio, conservado en este registro aunque cambie el dato externo.',
      },
    },
    {
      name: 'tipo',
      type: 'select',
      required: true,
      options: [
        { label: 'A', value: 'A' },
        { label: 'P', value: 'P' },
      ],
      admin: {
        description: 'Clasificación heredada A/P; sus reglas de préstamo se definirán después.',
      },
    },
    {
      name: 'grupo',
      type: 'select',
      required: true,
      options: [
        { label: 'Vecino', value: 'VECINO' },
        { label: 'Vecina', value: 'VECINA' },
        { label: 'Docente', value: 'DOCENTE' },
      ],
      admin: {
        description:
          'Grupo fijo del socio; los valores escolares heredados se normalizan al migrar.',
      },
    },
    {
      name: 'notas',
      type: 'textarea',
      admin: {
        description: 'Observaciones internas sobre el socio.',
      },
    },
    {
      name: 'activo',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Indica si el socio puede operar. Desactivarlo conserva sus préstamos e historial.',
      },
    },
  ],
}
