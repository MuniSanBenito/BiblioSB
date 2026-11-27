// Valores iniciales editables para los topes y plazos de préstamo.
import type { GlobalConfig } from 'payload'

export const ConfiguracionPrestamos: GlobalConfig = {
  slug: 'configuracion-prestamos',
  admin: {
    description: 'Topes de materiales abiertos y días de préstamo por tipo de socio.',
  },
  fields: [
    {
      name: 'tipo_a',
      type: 'group',
      label: 'Tipo A',
      admin: {
        description: 'Reglas iniciales para socios de tipo A.',
      },
      fields: [
        {
          name: 'maximo_prestamos',
          type: 'number',
          required: true,
          min: 1,
          validate: (value: number | null | undefined) =>
            Number.isInteger(value) || 'Ingresá un número entero mayor que cero.',
          defaultValue: 8,
          admin: {
            description: 'Cantidad máxima de préstamos abiertos para socios tipo A.',
          },
        },
        {
          name: 'dias_prestamo',
          type: 'number',
          required: true,
          min: 1,
          validate: (value: number | null | undefined) =>
            Number.isInteger(value) || 'Ingresá un número entero mayor que cero.',
          defaultValue: 30,
          admin: {
            description: 'Duración del préstamo en días para socios tipo A.',
          },
        },
      ],
    },
    {
      name: 'tipo_p',
      type: 'group',
      label: 'Tipo P',
      admin: {
        description: 'Reglas iniciales para socios de tipo P.',
      },
      fields: [
        {
          name: 'maximo_prestamos',
          type: 'number',
          required: true,
          min: 1,
          validate: (value: number | null | undefined) =>
            Number.isInteger(value) || 'Ingresá un número entero mayor que cero.',
          defaultValue: 9,
          admin: {
            description: 'Cantidad máxima de préstamos abiertos para socios tipo P.',
          },
        },
        {
          name: 'dias_prestamo',
          type: 'number',
          required: true,
          min: 1,
          validate: (value: number | null | undefined) =>
            Number.isInteger(value) || 'Ingresá un número entero mayor que cero.',
          defaultValue: 30,
          admin: {
            description: 'Duración del préstamo en días para socios tipo P.',
          },
        },
      ],
    },
    {
      name: 'tipo_d',
      type: 'group',
      label: 'Departamento',
      admin: {
        description: 'Reglas iniciales para préstamos a departamentos.',
      },
      fields: [
        {
          name: 'maximo_prestamos',
          type: 'number',
          required: true,
          min: 1,
          validate: (value: number | null | undefined) =>
            Number.isInteger(value) || 'Ingresá un número entero mayor que cero.',
          defaultValue: 10,
          admin: {
            description: 'Cantidad máxima de préstamos abiertos para departamentos.',
          },
        },
        {
          name: 'dias_prestamo',
          type: 'number',
          required: true,
          min: 1,
          validate: (value: number | null | undefined) =>
            Number.isInteger(value) || 'Ingresá un número entero mayor que cero.',
          defaultValue: 30,
          admin: {
            description: 'Duración del préstamo en días para departamentos.',
          },
        },
      ],
    },
  ],
}
