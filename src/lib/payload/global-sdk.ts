import 'server-only'

import { PayloadSDK } from '@payloadcms/sdk'

export const globalSdk = new PayloadSDK<any>({
  baseURL: process.env.EXTERNAL_API_BASE_URL || '',
  baseInit: {
    headers: {
      'Content-Type': 'application/json',
      token: process.env.EXTERNAL_API_KEY || '',
    },
  },
})
