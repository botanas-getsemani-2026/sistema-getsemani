export const CLIENT_CODE_PREFIX = 'GT-QR'
export const CLIENT_CODE_LENGTH = 5
export const CLIENT_CODE_GENERATION_MAX_ATTEMPTS = 5

export const CLIENT_PAGE_SIZE_OPTIONS = [50, 75, 100]
export const CLIENT_DEFAULT_PAGE_SIZE = CLIENT_PAGE_SIZE_OPTIONS[0]

export const CLIENT_CREDIT_OPTIONS = [
  { value: 'true', label: 'Sí' },
  { value: 'false', label: 'No' },
]

export const CLIENT_CREDIT_FILTER_ALL = 'todos'
export const CLIENT_VENDOR_FILTER_ALL = ''

export function generateClientCode() {
  const min = 0
  const max = Math.pow(10, CLIENT_CODE_LENGTH) - 1
  const digits = Math.floor(min + Math.random() * (max - min + 1))
    .toString()
    .padStart(CLIENT_CODE_LENGTH, '0')
  return `${CLIENT_CODE_PREFIX}-${digits}`
}
