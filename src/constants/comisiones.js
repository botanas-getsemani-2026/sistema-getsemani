export const PERIOD_STATUS = {
  ACTIVE: 'activo',
  PAID: 'pagado',
}

export const PERIOD_STATUS_LABELS = {
  [PERIOD_STATUS.ACTIVE]: 'Activo',
  [PERIOD_STATUS.PAID]: 'Pagado',
}

export const PERIOD_STATUS_COLORS = {
  [PERIOD_STATUS.ACTIVE]: 'bg-yellow-600',
  [PERIOD_STATUS.PAID]: 'bg-green-600',
}

export const ERROR_CODES = {
  PERIOD_OVERLAP: '23P01',
}

export const OVERLAP_MESSAGE =
  'El rango se traslapa con un periodo ya generado. Ajusta las fechas o elimina el periodo anterior.'

export const EMPTY_RANGE_MESSAGE =
  'No hay ventas registradas en este rango.'

export const COMMISSION_QUERY_KEY = 'commissionPreview'
export const PERIODS_QUERY_KEY = 'periods'
