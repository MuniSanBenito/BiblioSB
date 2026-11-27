// Cada documento representa una pieza física, no una obra abstracta o una cantidad de stock.
import type { CollectionConfig } from 'payload'

export const MaterialesCollection: CollectionConfig = {
  // Slug que Payload usa en la API y en las relaciones con préstamos.
  slug: 'materiales',
  admin: {
    description:
      'Catálogo e inventario de cada pieza física de la biblioteca, incluidos libros y otros soportes.',
  },
  access: {
    // La baja se marca en la ficha para no perder sus préstamos ni su historial.
    delete: () => false,
  },
  fields: [
    {
      // Número histórico y código que identifica una pieza individual.
      name: 'numero_registro',
      type: 'number',
      // El índice único evita reutilizar el número de registro.
      unique: true,
      admin: {
        // El número lo genera el hook y no debe editarse desde el panel.
        readOnly: true,
        description:
          'Número de registro y código de barras de la pieza; se asigna automáticamente y no se reutiliza.',
      },
    },
    {
      // Fecha en que la pieza ingresó al catálogo; algunos registros viejos no la tienen.
      name: 'fecha_alta',
      type: 'date',
      admin: {
        description:
          'Fecha en que la pieza ingresó al catálogo; puede quedar vacía si no se conoce.',
      },
    },
    {
      // Clasificación o ubicación del sistema viejo; puede repetirse en varias piezas.
      name: 'signatura',
      type: 'text',
      required: true,
      // Se consulta para buscar, pero no es un identificador único.
      index: true,
      admin: {
        description: 'Código de clasificación o ubicación heredado. Puede repetirse entre piezas.',
      },
    },
    {
      // Título de esta pieza concreta; varias copias pueden compartirlo.
      name: 'titulo',
      type: 'text',
      required: true,
      admin: {
        description: 'Título de la pieza tal como se identifica en el catálogo.',
      },
    },
    {
      // Algunos registros legados no tienen autor y se mantienen sin inventar un dato.
      name: 'autor',
      type: 'text',
      admin: {
        description:
          'Autor o responsable principal; se permite vacío para conservar registros legados incompletos.',
      },
    },
    {
      // Segundo autor o responsable, si fue informado.
      name: 'autor2',
      type: 'text',
      admin: {
        description: 'Segundo autor o responsable asociado a la pieza.',
      },
    },
    {
      // Campo heredado sin definición confirmada; se conserva para no perder el dato.
      name: 'omr',
      type: 'text',
      admin: {
        description: 'Dato heredado del campo OMR, conservado hasta confirmar su significado.',
      },
    },
    {
      // Editorial que publicó el material.
      name: 'editorial',
      type: 'text',
      admin: {
        description: 'Editorial que publicó la pieza, si se conoce.',
      },
    },
    {
      // Se guarda como texto porque el legado incluye valores inválidos y repetidos.
      name: 'isbn',
      type: 'text',
      admin: {
        description:
          'ISBN o identificador editorial tal como figura en el registro; no se valida como único.',
      },
    },
    {
      // Colección editorial, no confundir con la colección de Payload.
      name: 'coleccion',
      type: 'text',
      admin: {
        description: 'Colección editorial a la que pertenece la pieza, si corresponde.',
      },
    },
    {
      // Texto libre para conservar la edición como aparece en el catálogo.
      name: 'edicion',
      type: 'text',
      admin: {
        description: 'Información de edición registrada para la pieza.',
      },
    },
    {
      // Lugar de impresión indicado en la publicación.
      name: 'lugar_impresion',
      type: 'text',
      admin: {
        description: 'Lugar de impresión indicado en el registro.',
      },
    },
    {
      // Puede quedar vacío si el año no está impreso o no se conoce.
      name: 'anio_impresion',
      type: 'number',
      admin: {
        description: 'Año de impresión; puede quedar vacío si no está informado.',
      },
    },
    {
      // Una pieza puede tener varios temas; cada tema se administra en su propia colección.
      name: 'temas',
      type: 'relationship',
      relationTo: 'temas',
      hasMany: true,
      required: true,
      admin: {
        description:
          'Temas asociados a la pieza. La selección múltiple permite limpiar etiquetas compuestas del sistema viejo.',
      },
    },
    {
      // Relación a la lista administrable de idiomas.
      name: 'idioma',
      type: 'relationship',
      relationTo: 'idiomas',
      required: true,
      admin: {
        description: 'Idioma principal de la pieza, elegido de la lista administrable de idiomas.',
      },
    },
    {
      // Relación al formato físico, por ejemplo libro, revista o DVD.
      name: 'soporte',
      type: 'relationship',
      relationTo: 'soportes',
      required: true,
      admin: {
        description: 'Formato físico de la pieza, elegido de la lista administrable de soportes.',
      },
    },
    {
      // Enlace web opcional relacionado con el material.
      name: 'enlace',
      type: 'text',
      admin: {
        description: 'Enlace externo relacionado con la pieza, si existe.',
      },
    },
    {
      // Primera nota interna conservada desde el registro bibliográfico.
      name: 'notas',
      type: 'textarea',
      admin: {
        description: 'Primera observación o nota interna sobre la pieza.',
      },
    },
    {
      // Se conserva por separado porque parte de los textos heredados difiere de la primera nota.
      name: 'notas2',
      type: 'textarea',
      admin: {
        description:
          'Segunda nota heredada, conservada por separado para no descartar información.',
      },
    },
    {
      // Impide prestar la pieza, pero permite que se consulte dentro de la biblioteca.
      name: 'no_prestable',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Si está marcado, la pieza solo puede consultarse en la biblioteca.',
      },
    },
    {
      // Baja lógica: excluye la pieza de la circulación sin borrar su ficha histórica.
      name: 'dado_de_baja',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Marca una pieza retirada del inventario sin borrar su ficha ni su historial.',
      },
    },
    {
      // Se conserva el indicador legado aunque hoy la lista de espera no se use.
      name: 'en_lista_espera',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Indica si la pieza tiene una lista de espera activa.',
      },
    },
  ],
  hooks: {
    // Asigna un número al crear una pieza si la operación no entrega uno explícitamente.
    beforeValidate: [
      async ({ data, operation, req }) => {
        // Las actualizaciones, operaciones sin datos y migraciones con número se respetan.
        if (!data || operation !== 'create' || data.numero_registro != null) {
          return data
        }

        // Busca solo el registro más alto; numero_registro tiene índice único y ordenable.
        const ultimo = await req.payload.find({
          collection: 'materiales',
          depth: 0,
          limit: 1,
          // La asignación debe poder leer el catálogo independientemente del usuario actual.
          overrideAccess: true,
          sort: '-numero_registro',
        })

        // Si el catálogo está vacío empieza en 1; con el legado completo continúa desde 12454.
        data.numero_registro = (ultimo.docs[0]?.numero_registro ?? 0) + 1
        return data
      },
    ],
    // Mantiene inmutable el número de registro después de crear la pieza.
    beforeChange: [
      async ({ data, operation, originalDoc }) => {
        // Sin datos no hay campo que comprobar.
        if (!data) {
          return data
        }

        // Object.hasOwn distingue entre campo omitido en una actualización parcial y cambio explícito.
        if (
          operation === 'update' &&
          Object.hasOwn(data, 'numero_registro') &&
          data.numero_registro !== originalDoc?.numero_registro
        ) {
          throw new Error('El número de registro no se puede modificar.')
        }

        return data
      },
    ],
  },
}
