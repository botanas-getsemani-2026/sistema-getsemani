import { useState } from 'react'
import { X } from 'lucide-react'
import { PRODUCTS_STATUS, PRODUCT_STATUS_OPTIONS } from '../../../constants/products'
import { formatPrice } from '../../../utils/currencyUtils'

const EMPTY_FORM = {
  codigo: '',
  nombre: '',
  precio: '',
  es_a_granel: false,
  estado: PRODUCTS_STATUS.ACTIVE,
}

function buildInitialForm(product) {
  if (!product) return EMPTY_FORM
  return {
    codigo: product.codigo ?? '',
    nombre: product.nombre ?? '',
    precio: String((product.precio ?? 0) / 100),
    es_a_granel: !!product.es_a_granel,
    estado: product.estado ?? PRODUCTS_STATUS.ACTIVE,
  }
}

export function ProductFormModal({
  isOpen,
  product,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(() => buildInitialForm(product))
  const [validationError, setValidationError] = useState('')

  if (!isOpen) return null

  const isEdit = !!product

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    if (!form.codigo.trim()) return 'El código es obligatorio.'
    if (!form.nombre.trim()) return 'El nombre es obligatorio.'
    const precioNumber = Number(form.precio)
    if (form.precio === '' || Number.isNaN(precioNumber) || precioNumber <= 0) {
      return 'El precio debe ser mayor a 0.'
    }
    return ''
  }

  const handleSubmit = e => {
    e.preventDefault()
    const message = validate()
    if (message) {
      setValidationError(message)
      return
    }
    setValidationError('')
    onSubmit({
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      precio: formatPrice(Number(form.precio)),
      es_a_granel: form.es_a_granel,
      estado: form.estado,
    })
  }

  const handleClose = () => {
    onClose()
  }

  const visibleError = validationError || errorMessage

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/50'
        onClick={handleClose}
        aria-hidden='true'
      />
      <form
        onSubmit={handleSubmit}
        className='relative bg-surface border border-outline rounded-lg shadow-xl w-full max-w-md p-6'
      >
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-on-background'>
            {isEdit ? 'Editar producto' : 'Nuevo producto'}
          </h3>
          <button
            type='button'
            onClick={handleClose}
            className='p-1 rounded hover:bg-surface-variant transition-colors'
            aria-label='Cerrar'
          >
            <X size={20} />
          </button>
        </div>

        <div className='space-y-4'>
          <div>
            <label
              htmlFor='product-codigo'
              className='block text-sm text-on-surface-variant mb-1'
            >
              Código
            </label>
            <input
              id='product-codigo'
              type='text'
              value={form.codigo}
              onChange={e => handleChange('codigo', e.target.value)}
              className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background'
              autoComplete='off'
              required
            />
          </div>

          <div>
            <label
              htmlFor='product-nombre'
              className='block text-sm text-on-surface-variant mb-1'
            >
              Nombre
            </label>
            <input
              id='product-nombre'
              type='text'
              value={form.nombre}
              onChange={e => handleChange('nombre', e.target.value)}
              className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background'
              autoComplete='off'
              required
            />
          </div>

          <div>
            <label
              htmlFor='product-precio'
              className='block text-sm text-on-surface-variant mb-1'
            >
              Precio (en pesos)
            </label>
            <input
              id='product-precio'
              type='number'
              min='0.01'
              step='0.01'
              value={form.precio}
              onChange={e => handleChange('precio', e.target.value)}
              className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background'
              required
            />
          </div>

          <label className='flex items-center gap-2 text-on-background cursor-pointer'>
            <input
              type='checkbox'
              checked={form.es_a_granel}
              onChange={e => handleChange('es_a_granel', e.target.checked)}
              className='w-4 h-4 accent-primary'
            />
            <span>Se vende a granel</span>
          </label>

          <div>
            <label
              htmlFor='product-estado'
              className='block text-sm text-on-surface-variant mb-1'
            >
              Estado
            </label>
            <select
              id='product-estado'
              value={form.estado}
              onChange={e => handleChange('estado', e.target.value)}
              className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background'
            >
              {PRODUCT_STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {visibleError && (
            <p className='text-sm text-red-500' role='alert'>
              {visibleError}
            </p>
          )}
        </div>

        <div className='flex gap-3 mt-6'>
          <button
            type='button'
            onClick={handleClose}
            className='flex-1 px-4 py-2 border border-outline rounded-md hover:bg-surface-variant transition-colors text-on-background'
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type='submit'
            disabled={isSubmitting}
            className='flex-1 px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </form>
    </div>
  )
}
