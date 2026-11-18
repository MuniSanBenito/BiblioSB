import { STAFF_ROLES } from '@/data/roles'
import type { CollectionConfig } from 'payload'

export const UsersCollection: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [...STAFF_ROLES],
      required: true,
      defaultValue: STAFF_ROLES[1].value,
    },
    // hidden fields
    {
      name: 'dev',
      type: 'checkbox',
      defaultValue: false,
      access: {
        create: ({ req }) => Boolean(req.user?.dev),
        read: ({ req }) => Boolean(req.user?.dev),
        update: ({ req }) => Boolean(req.user?.dev),
      },
    },
  ],
}
