// Esta colección separa al socio de su ciudadano correspondiente en la API externa.
import type { CollectionConfig } from 'payload'

export const SociosCollection: CollectionConfig = {
  // Slug que Payload usa en la API y en las relaciones de préstamos.
  slug: 'socios',
  admin: {
    description:
      'Personas habilitadas como socios y su vínculo opcional con el padrón externo de ciudadanos.',
  },
  access: {
    // Se desactiva un socio cuando corresponda; no se borra y no se rompen sus préstamos.
    delete: () => false,
  },
  fields: [
    {
      // DNI real del ciudadano; los socios legados pueden no tenerlo todavía.
      name: 'dni',
      type: 'text',
      // Unique opcional: Mongo crea un índice sparse para los socios sin DNI.
      unique: true,
      admin: {
        description:
          'Documento normalizado, sin puntos ni ceros iniciales. Es opcional para socios legados y único cuando está informado.',
      },
    },
    {
      // El sistema viejo usaba este número como si fuera DNI, pero es solo un código interno.
      name: 'numero_socio_legado',
      type: 'number',
      // Evita duplicar el código heredado y permite que los socios nuevos no tengan uno.
      unique: true,
      admin: {
        description: 'Identificador interno del socio en el sistema viejo; no es un DNI.',
      },
    },
    {
      // ID del registro externo: no es una relación Payload porque vive en otra instancia.
      name: 'ciudadano_id',
      type: 'text',
      index: true,
      admin: {
        description:
          'Identificador del ciudadano en la instancia externa de Payload, si ya fue vinculado.',
      },
    },
    {
      // Permite distinguir los socios importados de los creados en el sistema nuevo.
      name: 'origen',
      type: 'select',
      required: true,
      // Los registros nuevos nacen con este valor; la importación debe indicar "legado".
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
      // Se conserva una copia local para mostrar el historial aunque cambien datos externos.
      name: 'apellido',
      type: 'text',
      admin: {
        description:
          'Apellido del socio; puede quedar vacío para departamentos. Se conserva aunque cambie el dato externo.',
      },
    },
    {
      // Para socios tipo D, este campo guarda la denominación del departamento.
      name: 'nombre',
      type: 'text',
      required: true,
      admin: {
        description: 'Nombre del socio, conservado en este registro aunque cambie el dato externo.',
      },
    },
    {
      // El tipo determina el tope de préstamos y los días configurados en el Global.
      name: 'tipo',
      type: 'select',
      required: true,
      options: [
        { label: 'A', value: 'A' },
        { label: 'P', value: 'P' },
        { label: 'D — Departamento', value: 'D' },
      ],
      admin: {
        description:
          'Clasificación del socio para aplicar los topes y plazos de préstamo configurados.',
      },
    },
    {
      // El grupo describe al socio; para tipo D el hook lo establece automáticamente.
      name: 'grupo',
      type: 'select',
      options: [
        { label: 'Vecino', value: 'VECINO' },
        { label: 'Vecina', value: 'VECINA' },
        { label: 'Docente', value: 'DOCENTE' },
        { label: 'Departamento', value: 'DEPARTAMENTO' },
      ],
      admin: {
        description:
          'Grupo fijo del socio; los valores escolares heredados se normalizan al migrar.',
      },
    },
    {
      // Notas propias del socio; no se mezclan con las notas de cada préstamo.
      name: 'notas',
      type: 'textarea',
      admin: {
        description: 'Observaciones internas sobre el socio.',
      },
    },
    {
      // Una baja lógica conserva las relaciones y el historial del socio.
      name: 'activo',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Indica si el socio puede operar. Desactivarlo conserva sus préstamos e historial.',
      },
    },
  ],
  hooks: {
    // Normaliza los datos y aplica las diferencias entre personas y departamentos.
    beforeValidate: [
      async ({ data, operation, originalDoc }) => {
        // Algunas operaciones de Payload pueden ejecutarse sin un objeto de datos.
        if (!data) {
          return data
        }

        // Un DNI que no llega en una actualización parcial no se toca.
        if (typeof data.dni === 'string') {
          // Se quitan separadores habituales antes de guardar el documento.
          const documento = data.dni.trim().replace(/[.\s-]/g, '')

          if (!documento) {
            // En una creación, un DNI vacío equivale a no informar el campo.
            if (operation === 'create' || !originalDoc?.dni) {
              data.dni = undefined
            }
            // En una actualización no se acepta que un DNI existente quede vacío accidentalmente.
            else {
              throw new Error('Ingresá un DNI válido para reemplazar el DNI actual.')
            }
          } else if (!/^\d+$/.test(documento)) {
            // Evita guardar letras u otros caracteres como parte de un DNI.
            throw new Error('El DNI debe contener únicamente números y separadores habituales.')
          } else {
            // Los ceros iniciales se quitan para que el mismo DNI tenga una sola representación.
            const dniNormalizado = documento.replace(/^0+/, '')

            if (!dniNormalizado) {
              throw new Error('Ingresá un DNI distinto de cero.')
            }

            data.dni = dniNormalizado
          }
        } else if (data.dni === null && originalDoc?.dni) {
          // Null explícito tampoco debe borrar silenciosamente un DNI existente.
          throw new Error('Ingresá un DNI válido para reemplazar el DNI actual.')
        }

        // En una actualización parcial, recupera los valores del documento guardado.
        const tipo = data.tipo ?? originalDoc?.tipo
        const apellido = data.apellido ?? originalDoc?.apellido
        const nombre = data.nombre ?? originalDoc?.nombre

        // Personas y departamentos deben tener un nombre o denominación.
        if (!nombre?.trim()) {
          throw new Error('El socio debe tener un nombre o denominación.')
        }

        if (tipo === 'D') {
          // La categoría D siempre usa el grupo de departamento y no lleva apellido personal.
          data.grupo = 'DEPARTAMENTO'
          data.apellido = null
        } else {
          // Para A/P se conservan ambos datos personales y se exige un grupo válido.
          if (!apellido?.trim()) {
            throw new Error('El socio debe tener apellido, excepto si es un departamento.')
          }

          const grupo = data.grupo ?? originalDoc?.grupo

          if (!grupo) {
            throw new Error('Seleccioná un grupo para el socio.')
          }

          if (grupo === 'DEPARTAMENTO') {
            // Evita que una persona use el grupo reservado para el tipo D.
            throw new Error('El grupo DEPARTAMENTO requiere que el tipo de socio sea D.')
          }
        }

        return data
      },
    ],
  },
}
