export const PRODUCTS_STATUS = {
  ACTIVE: 'activo',
  INACTIVE: 'inactivo',
  DISCONTINUED: 'descontinuado',
}

export const PRODUCT_STATUS_OPTIONS = [
  { value: PRODUCTS_STATUS.ACTIVE, label: 'Activo' },
  { value: PRODUCTS_STATUS.INACTIVE, label: 'Inactivo' },
  { value: PRODUCTS_STATUS.DISCONTINUED, label: 'Descontinuado' },
]

export const PRODUCT_STATUS_COLORS = {
  [PRODUCTS_STATUS.ACTIVE]: 'bg-green-600',
  [PRODUCTS_STATUS.INACTIVE]: 'bg-yellow-600',
  [PRODUCTS_STATUS.DISCONTINUED]: 'bg-red-600',
}

export const PRODUCT_TYPE_FILTER = {
  ALL: 'todos',
  BULK: 'granel',
  UNIT: 'pieza',
}

export const PRODUCT_TYPE_OPTIONS = [
  { value: PRODUCT_TYPE_FILTER.ALL, label: 'Todos' },
  { value: PRODUCT_TYPE_FILTER.BULK, label: 'Granel' },
  { value: PRODUCT_TYPE_FILTER.UNIT, label: 'Por pieza' },
]
