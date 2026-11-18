export const STAFF_ROLES = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Bibliotecaria', value: 'bibliotecaria' },
] as const

export type StaffRole = (typeof STAFF_ROLES)[number]
