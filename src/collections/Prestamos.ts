// Los préstamos conservan el historial y apuntan al socio y a la pieza física.
import type { CollectionConfig, CollectionSlug } from 'payload'

export const PrestamosCollection: CollectionConfig = {
  slug: 'prestamos',
  admin: {
    useAsTitle: 'fecha_prestamo',
    description:
      'Movimientos de préstamo de materiales a socios, con su estado y fechas para conservar el historial.',
  },
  fields: [
    {
      name: 'material',
      type: 'relationship',
      relationTo: 'materiales' as CollectionSlug,
      required: true,
      index: true,
      admin: {
        description: 'Pieza física entregada en este préstamo.',
      },
    },
    {
      name: 'socio',
      type: 'relationship',
      relationTo: 'socios' as CollectionSlug,
      required: true,
      index: true,
      admin: {
        description:
          'Socio responsable del préstamo. El socio puede no estar vinculado aún a un ciudadano externo.',
      },
    },
    {
      name: 'fecha_prestamo',
      type: 'date',
      required: true,
      admin: {
        description: 'Fecha en que se entregó el material al socio.',
      },
    },
    {
      name: 'fecha_vencimiento',
      type: 'date',
      required: true,
      index: true,
      admin: {
        description: 'Fecha límite prevista para devolver el material.',
      },
    },
    {
      name: 'estado',
      type: 'select',
      required: true,
      defaultValue: 'prestado',
      options: [
        { label: 'Prestado', value: 'prestado' },
        { label: 'Devuelto', value: 'devuelto' },
        { label: 'Anulado', value: 'anulado' },
      ],
      admin: {
        description:
          'Situación actual del movimiento. Los préstamos abiertos vencidos permanecen como prestados.',
      },
    },
    {
      name: 'fecha_devolucion',
      type: 'date',
      admin: {
        description: 'Fecha efectiva de devolución; queda vacía si no se conoce o sigue prestado.',
      },
    },
    {
      name: 'renovaciones',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Cantidad de veces que se extendió el vencimiento del préstamo.',
      },
    },
    {
      name: 'notas',
      type: 'textarea',
      admin: {
        description: 'Observaciones sobre este movimiento de préstamo.',
      },
    },
    {
      name: 'creado_por',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Usuario del sistema que registró el préstamo, si está disponible.',
      },
    },
  ],
}
