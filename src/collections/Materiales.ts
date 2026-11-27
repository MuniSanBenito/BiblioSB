// Cada documento representa una pieza física y conserva el número de registro heredado.
import type { CollectionConfig, CollectionSlug } from 'payload'

export const MaterialesCollection: CollectionConfig = {
  slug: 'materiales',
  admin: {
    useAsTitle: 'titulo',
    description:
      'Catálogo e inventario de cada pieza física de la biblioteca, incluidos libros y otros soportes.',
  },
  fields: [
    {
      name: 'numero_registro',
      type: 'number',
      required: true,
      unique: true,
      admin: {
        description: 'Número de registro y código de barras de la pieza; no se reutiliza.',
      },
    },
    {
      name: 'fecha_alta',
      type: 'date',
      admin: {
        description:
          'Fecha en que la pieza ingresó al catálogo; puede quedar vacía si no se conoce.',
      },
    },
    {
      name: 'signatura',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Código de clasificación o ubicación heredado. Puede repetirse entre piezas.',
      },
    },
    {
      name: 'titulo',
      type: 'text',
      required: true,
      admin: {
        description: 'Título de la pieza tal como se identifica en el catálogo.',
      },
    },
    {
      name: 'autor',
      type: 'text',
      admin: {
        description:
          'Autor o responsable principal; se permite vacío para conservar registros legados incompletos.',
      },
    },
    {
      name: 'autor2',
      type: 'text',
      admin: {
        description: 'Segundo autor o responsable asociado a la pieza.',
      },
    },
    {
      name: 'omr',
      type: 'text',
      admin: {
        description: 'Dato heredado del campo OMR, conservado hasta confirmar su significado.',
      },
    },
    {
      name: 'editorial',
      type: 'text',
      admin: {
        description: 'Editorial que publicó la pieza, si se conoce.',
      },
    },
    {
      name: 'isbn',
      type: 'text',
      admin: {
        description:
          'ISBN o identificador editorial tal como figura en el registro; no se valida como único.',
      },
    },
    {
      name: 'coleccion',
      type: 'text',
      admin: {
        description: 'Colección editorial a la que pertenece la pieza, si corresponde.',
      },
    },
    {
      name: 'edicion',
      type: 'text',
      admin: {
        description: 'Información de edición registrada para la pieza.',
      },
    },
    {
      name: 'lugar_impresion',
      type: 'text',
      admin: {
        description: 'Lugar de impresión indicado en el registro.',
      },
    },
    {
      name: 'anio_impresion',
      type: 'number',
      admin: {
        description: 'Año de impresión; puede quedar vacío si no está informado.',
      },
    },
    {
      name: 'temas',
      type: 'relationship',
      relationTo: 'temas' as CollectionSlug,
      hasMany: true,
      required: true,
      admin: {
        description:
          'Temas asociados a la pieza. La selección múltiple permite limpiar etiquetas compuestas del sistema viejo.',
      },
    },
    {
      name: 'idioma',
      type: 'relationship',
      relationTo: 'idiomas' as CollectionSlug,
      required: true,
      admin: {
        description: 'Idioma principal de la pieza, elegido de la lista administrable de idiomas.',
      },
    },
    {
      name: 'soporte',
      type: 'relationship',
      relationTo: 'soportes' as CollectionSlug,
      required: true,
      admin: {
        description: 'Formato físico de la pieza, elegido de la lista administrable de soportes.',
      },
    },
    {
      name: 'enlace',
      type: 'text',
      admin: {
        description: 'Enlace externo relacionado con la pieza, si existe.',
      },
    },
    {
      name: 'notas',
      type: 'textarea',
      admin: {
        description: 'Primera observación o nota interna sobre la pieza.',
      },
    },
    {
      name: 'notas2',
      type: 'textarea',
      admin: {
        description:
          'Segunda nota heredada, conservada por separado para no descartar información.',
      },
    },
    {
      name: 'no_prestable',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Si está marcado, la pieza solo puede consultarse en la biblioteca.',
      },
    },
    {
      name: 'dado_de_baja',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Marca una pieza retirada del inventario sin borrar su ficha ni su historial.',
      },
    },
    {
      name: 'en_lista_espera',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Indica si la pieza tiene una lista de espera activa.',
      },
    },
  ],
}
