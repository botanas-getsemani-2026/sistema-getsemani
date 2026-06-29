export const VENDOR_STATUS = {
  ACTIVE: 'activo',
  INACTIVE: 'inactivo',
}

export const VENDOR_STATUS_OPTIONS = [
  { value: VENDOR_STATUS.ACTIVE, label: 'Activo' },
  { value: VENDOR_STATUS.INACTIVE, label: 'Inactivo' },
]

export const VENDOR_STATUS_COLORS = {
  [VENDOR_STATUS.ACTIVE]: 'bg-green-600',
  [VENDOR_STATUS.INACTIVE]: 'bg-red-600',
}

export const VENDOR_STATUS_FILTER = {
  ALL: 'todos',
  ACTIVE: 'activo',
  INACTIVE: 'inactivo',
}

export const VENDOR_STATUS_FILTER_OPTIONS = [
  { value: VENDOR_STATUS_FILTER.ALL, label: 'Todos' },
  { value: VENDOR_STATUS_FILTER.ACTIVE, label: 'Activo' },
  { value: VENDOR_STATUS_FILTER.INACTIVE, label: 'Inactivo' },
]

export const VENDOR_ROLES = ['admin', 'vendedor', 'supervisor', 'desarrollador']

export const VENDOR_ROLES_OPTIONS = [
  { value: 'admin', label: 'Administrador' },
  { value: 'vendedor', label: 'Vendedor' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'desarrollador', label: 'Desarrollador' },
]

export const VENDOR_DEFAULT_ROLE = 'vendedor'

export const VENDOR_EMAIL_DOMAIN = '@getsemani.com'

export function generateLocalUsername() {
  const digits = Math.floor(1000 + Math.random() * 9000).toString()
  return `get${digits}`
}