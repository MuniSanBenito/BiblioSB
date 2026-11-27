import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { IdiomasCollection } from './collections/Idiomas'
import { MaterialesCollection } from './collections/Materiales'
import { PrestamosCollection } from './collections/Prestamos'
import { SociosCollection } from './collections/Socios'
import { SoportesCollection } from './collections/Soportes'
import { TemasCollection } from './collections/Temas'
import { UsersCollection } from './collections/Users'
import { ConfiguracionPrestamos } from './globals/ConfiguracionPrestamos'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: UsersCollection.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      providers: ['/context/admin-guard-provider#AdminGuardProvider'],
    },
  },
  collections: [
    IdiomasCollection,
    MaterialesCollection,
    PrestamosCollection,
    SociosCollection,
    SoportesCollection,
    TemasCollection,
    UsersCollection,
  ],
  globals: [ConfiguracionPrestamos],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})
