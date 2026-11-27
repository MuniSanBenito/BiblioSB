// Esta colección guarda cada préstamo como un movimiento histórico, no como un estado del material.
import type { ConfiguracionPrestamo, Socio } from '@/payload-types'
import { randomUUID } from 'node:crypto'
import type { CollectionConfig } from 'payload'

// Payload puede entregar una relación como ID o como documento poblado.
function getRelationID(value: unknown): string | undefined {
  // Los IDs de Payload suelen ser texto; algunos adaptadores pueden devolverlos como número.
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  // Si la relación está poblada, extrae el ID del documento relacionado.
  if (value && typeof value === 'object') {
    const relation = value as { id?: unknown; _id?: unknown }
    const id = relation.id ?? relation._id

    if (id !== undefined) {
      return getRelationID(id)
    }

    // Mongo ObjectId no siempre expone id/_id, pero su texto representa el identificador.
    const objectID = String(value)

    return objectID === '[object Object]' ? undefined : objectID
  }

  // Null, undefined y valores inesperados no representan una relación válida.
  return undefined
}

// Devuelve la fecha actual según la zona de la biblioteca, no la del servidor.
function getLibraryDate(): string {
  // formatToParts permite construir YYYY-MM-DD sin depender del formato visual del locale.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Cordoba',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  // Si el entorno no puede formar la fecha completa, es mejor detener la operación.
  if (!year || !month || !day) {
    throw new Error('No se pudo determinar la fecha de la biblioteca.')
  }

  return `${year}-${month}-${day}`
}

// Suma días calendario a una fecha ISO sin aplicar la zona horaria local del servidor.
function addDays(dateValue: string, days: number): string {
  // Payload entrega fechas como YYYY-MM-DD; se separan sus partes antes de crear la fecha UTC.
  const [year, month, day] = dateValue.slice(0, 10).split('-').map(Number)

  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + days)

  // Se devuelve solo la fecha, sin hora ni zona horaria.
  return date.toISOString().slice(0, 10)
}

// Lee las reglas del Global y conserva los valores históricos como respaldo.
function getLoanPolicy(config: ConfiguracionPrestamo, type: Socio['tipo']) {
  // Estos valores permiten operar aunque el Global todavía no se haya guardado.
  const defaults = {
    A: { maximo_prestamos: 8, dias_prestamo: 30 },
    P: { maximo_prestamos: 9, dias_prestamo: 30 },
    D: { maximo_prestamos: 10, dias_prestamo: 30 },
  }

  // Cada tipo de socio tiene su propio grupo de topes y duración en la configuración.
  const configured = type === 'A' ? config?.tipo_a : type === 'P' ? config?.tipo_p : config?.tipo_d

  // Si un valor falta en el Global, se usa el valor inicial correspondiente al tipo.
  return {
    maximo_prestamos: configured?.maximo_prestamos ?? defaults[type].maximo_prestamos,
    dias_prestamo: configured?.dias_prestamo ?? defaults[type].dias_prestamo,
  }
}

export const PrestamosCollection: CollectionConfig = {
  // Slug usado por Payload en la API y en las relaciones.
  slug: 'prestamos',
  admin: {
    description:
      'Movimientos de préstamo de materiales a socios, con su estado y fechas para conservar el historial.',
  },
  access: {
    // Los préstamos se cierran o anulan; nunca se borran del historial.
    delete: () => false,
  },
  // El primer índice acelera el historial/tope por socio; el segundo, los vencimientos por estado.
  indexes: [{ fields: ['socio', 'estado'] }, { fields: ['estado', 'fecha_vencimiento'] }],
  fields: [
    {
      // Pieza física que se lleva el socio; el historial puede tener varias filas para la misma pieza.
      name: 'material',
      type: 'relationship',
      relationTo: 'materiales',
      required: true,
      index: true,
      admin: {
        description: 'Pieza física entregada en este préstamo.',
      },
    },
    {
      // Clave auxiliar única que impide que una pieza tenga dos préstamos abiertos.
      name: 'material_abierto_clave',
      type: 'text',
      unique: true,
      admin: {
        // Es un dato técnico; no debe editarse desde el panel.
        hidden: true,
        description:
          'Clave interna única: comparte el ID del material mientras el préstamo está abierto.',
      },
    },
    {
      // El socio es la relación local; su vínculo con el ciudadano externo es opcional.
      name: 'socio',
      type: 'relationship',
      relationTo: 'socios',
      required: true,
      admin: {
        description:
          'Socio responsable del préstamo. Puede no estar vinculado aún a un ciudadano externo.',
      },
    },
    {
      // Fecha en que la pieza salió de la biblioteca.
      name: 'fecha_prestamo',
      type: 'date',
      required: true,
      admin: {
        description: 'Fecha en que se entregó el material al socio.',
      },
    },
    {
      // El hook la calcula con el plazo configurado para el tipo de socio.
      name: 'fecha_vencimiento',
      type: 'date',
      admin: {
        // Evita que el panel permita apartarse del plazo configurado al crear el préstamo.
        readOnly: true,
        description: 'Fecha límite calculada con los días configurados para el tipo de socio.',
      },
    },
    {
      // El estado define si el préstamo sigue ocupando la pieza y contando para el tope del socio.
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
          'Situación del movimiento. Un préstamo vencido sigue prestado hasta que se registre su devolución.',
      },
    },
    {
      // Los préstamos legados cerrados pueden no tener una fecha real de devolución disponible.
      name: 'fecha_devolucion',
      type: 'date',
      admin: {
        description: 'Fecha efectiva de devolución; el historial legado puede no tenerla.',
      },
    },
    {
      // El contador se incrementará cuando se implemente el flujo de renovación.
      name: 'renovaciones',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Cantidad de veces que se extendió el vencimiento del préstamo.',
      },
    },
    {
      // Observaciones propias de este movimiento, no del socio ni del material.
      name: 'notas',
      type: 'textarea',
      admin: {
        description: 'Observaciones sobre este movimiento de préstamo.',
      },
    },
    {
      // Usuario interno que registró la operación; puede faltar en préstamos importados.
      name: 'creado_por',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Usuario del sistema que registró el préstamo, si está disponible.',
      },
    },
  ],
  hooks: {
    // Completa fechas antes de que Payload valide los campos requeridos.
    beforeValidate: [
      async ({ data, operation, originalDoc, req }) => {
        // Algunas operaciones de Payload no traen datos para validar.
        if (!data) return data

        // Las fechas automáticas usan siempre el calendario local de la biblioteca.
        const fechaHoy = getLibraryDate()
        const fechaPrestamo = data.fecha_prestamo ?? originalDoc?.fecha_prestamo ?? fechaHoy
        const socioID = getRelationID(data.socio ?? originalDoc?.socio)

        // Si una creación llega sin fecha de entrega, se toma el día actual de San Benito.
        if (operation === 'create' && !data.fecha_prestamo) {
          data.fecha_prestamo = fechaHoy
        }

        // En una creación sin vencimiento, el socio determina cuántos días se prestará el material.
        if (operation === 'create' && !data.fecha_vencimiento) {
          if (!socioID) {
            throw new Error('Seleccioná un socio para calcular el vencimiento del préstamo.')
          }

          // La relación se consulta para conocer el tipo A, P o D del socio.
          // Depth 0 evita cargar relaciones que no hacen falta para esta regla.
          const socio = await req.payload.findByID({
            collection: 'socios',
            id: socioID,
            depth: 0,
            overrideAccess: true,
          })

          // Los topes y plazos editables están centralizados en un Global.
          // La lectura interna debe funcionar aunque el usuario no tenga acceso directo al Global.
          const config = await req.payload.findGlobal({
            slug: 'configuracion-prestamos',
            depth: 0,
            overrideAccess: true,
          })

          const policy = getLoanPolicy(config, socio.tipo)

          // Rechaza una configuración inválida en lugar de guardar un vencimiento imprevisible.
          if (!Number.isInteger(policy.dias_prestamo) || policy.dias_prestamo < 1) {
            throw new Error('Los días de préstamo deben ser un número entero mayor que cero.')
          }

          // Solo se llega aquí si no se recibió vencimiento; las fechas legadas explícitas se respetan.
          data.fecha_vencimiento = addDays(fechaPrestamo, policy.dias_prestamo)
        }

        return data
      },
    ],
    // Aplica las reglas de circulación justo antes de guardar el movimiento.
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        // No hay movimiento que modificar si Payload no entrega un objeto de datos.
        if (!data) {
          return data
        }

        // En una edición parcial se completan estado y relaciones desde el documento existente.
        const estado = data.estado ?? originalDoc?.estado ?? 'prestado'
        const materialID = getRelationID(data.material ?? originalDoc?.material)
        const socioID = getRelationID(data.socio ?? originalDoc?.socio)

        // No se permite guardar préstamos sin su socio o pieza asociados.
        if (!materialID || !socioID) {
          throw new Error('El préstamo necesita un socio y un material.')
        }

        // Las fechas son obligatorias para préstamos nuevos e históricos.
        // Payload permite actualizaciones parciales; un null explícito también se rechaza.
        if (
          data.fecha_prestamo === null ||
          (!data.fecha_prestamo && !originalDoc?.fecha_prestamo)
        ) {
          throw new Error('El préstamo necesita una fecha de entrega.')
        }

        if (
          data.fecha_vencimiento === null ||
          (!data.fecha_vencimiento && !originalDoc?.fecha_vencimiento)
        ) {
          throw new Error('No se pudo calcular la fecha de vencimiento del préstamo.')
        }

        // Un préstamo cerrado permanece en el historial; una nueva entrega crea otro movimiento.
        if (operation === 'update' && originalDoc?.estado !== 'prestado' && estado === 'prestado') {
          throw new Error('Un préstamo cerrado no se puede reabrir; registrá un préstamo nuevo.')
        }

        // Payload no declara aquí un índice único parcial; esta clave representa solo la ocupación actual.
        // Mientras está abierto, todas las copias del mismo material comparten la misma clave.
        if (estado === 'prestado') {
          data.material_abierto_clave = `abierto:${materialID}`
        } else if (originalDoc?.estado !== 'prestado' && originalDoc?.material_abierto_clave) {
          // Si ya estaba cerrado, conserva su clave estable al editar notas u otros datos.
          data.material_abierto_clave = originalDoc.material_abierto_clave
        } else {
          // Al cerrar, recibe una clave propia y libera la clave compartida del material.
          data.material_abierto_clave = `cerrado:${randomUUID()}`
        }

        // Una devolución hecha ahora queda fechada; el histórico importado conserva fechas desconocidas.
        if (estado === 'devuelto' && originalDoc?.estado === 'prestado' && !data.fecha_devolucion) {
          data.fecha_devolucion = getLibraryDate()
        }

        // Solo se revisan reglas de alta cuando se crea, se abre o se reasigna un préstamo abierto.
        const cambioAAbierto =
          estado === 'prestado' &&
          (operation === 'create' ||
            originalDoc?.estado !== 'prestado' ||
            materialID !== getRelationID(originalDoc?.material) ||
            socioID !== getRelationID(originalDoc?.socio))

        // Editar notas u otros datos de un préstamo abierto no requiere repetir las consultas.
        if (!cambioAAbierto) {
          return data
        }

        // Se leen en paralelo las dos fichas necesarias para validar el préstamo.
        // overrideAccess permite comprobar los datos internos sin depender de permisos de lectura de la sesión.
        const [material, socio] = await Promise.all([
          req.payload.findByID({
            collection: 'materiales',
            id: materialID,
            depth: 0,
            overrideAccess: true,
          }),
          req.payload.findByID({
            collection: 'socios',
            id: socioID,
            depth: 0,
            overrideAccess: true,
          }),
        ])

        // Una pieza retirada no puede iniciar un nuevo préstamo.
        if (material.dado_de_baja) {
          throw new Error('No se puede prestar un material dado de baja.')
        }

        // Los materiales de consulta en sala no circulan fuera de la biblioteca.
        if (material.no_prestable) {
          throw new Error('Este material es solo para consulta en la biblioteca.')
        }

        // Un socio inactivo conserva su historial, pero no puede recibir préstamos nuevos.
        if (socio.activo === false) {
          throw new Error('No se puede prestar a un socio inactivo.')
        }

        // count devuelve el total sin traer los documentos completos a memoria.
        // El índice auxiliar único es la protección final si dos altas compiten por la misma pieza.
        const prestamosDelMaterial = await req.payload.count({
          collection: 'prestamos',
          where: {
            and: [{ material: { equals: materialID } }, { estado: { equals: 'prestado' } }],
          },
          overrideAccess: true,
        })

        // Al editar el mismo préstamo, no debe contarse como otro préstamo de la pieza.
        const mantieneMaterialActual =
          originalDoc?.estado === 'prestado' && materialID === getRelationID(originalDoc.material)

        // Number convierte el booleano en 1 o 0 para restar el préstamo editado, si corresponde.
        const prestamosAbiertosDelMaterial =
          prestamosDelMaterial.totalDocs - Number(mantieneMaterialActual)

        if (prestamosAbiertosDelMaterial > 0) {
          throw new Error('Este material ya tiene un préstamo abierto.')
        }

        // Cuenta los préstamos abiertos del socio, incluso si ya están vencidos.
        // Este conteo aplica el tope, aunque no bloquea dos altas simultáneas para el mismo socio.
        const prestamosDelSocio = await req.payload.count({
          collection: 'prestamos',
          where: {
            and: [{ socio: { equals: socioID } }, { estado: { equals: 'prestado' } }],
          },
          overrideAccess: true,
        })

        // Si se está editando un préstamo del mismo socio, se excluye del conteo previo.
        const mantienePrestamoActual =
          originalDoc?.estado === 'prestado' && socioID === getRelationID(originalDoc.socio)

        // Excluye del total el préstamo que se está editando si pertenece al mismo socio.
        const prestamosActuales = prestamosDelSocio.totalDocs - Number(mantienePrestamoActual)

        // El límite permitido depende del tipo de socio y puede cambiarse desde el Global.
        const config = await req.payload.findGlobal({
          slug: 'configuracion-prestamos',
          depth: 0,
          overrideAccess: true,
        })

        const policy = getLoanPolicy(config, socio.tipo)

        // No se aplica una regla si la configuración fue cargada con un número inválido.
        if (!Number.isInteger(policy.maximo_prestamos) || policy.maximo_prestamos < 1) {
          throw new Error('El tope de préstamos debe ser un número entero mayor que cero.')
        }

        // El préstamo nuevo se rechaza cuando el socio ya alcanzó su máximo de préstamos abiertos.
        if (prestamosActuales >= policy.maximo_prestamos) {
          throw new Error(
            `El socio ya alcanzó su tope de ${policy.maximo_prestamos} préstamos abiertos.`,
          )
        }

        return data
      },
    ],
  },
}
