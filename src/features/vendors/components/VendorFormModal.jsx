import { RefreshCw, X } from 'lucide-react'
import { useState } from 'react'
import {
  generateLocalUsername,
  VENDOR_DEFAULT_ROLE,
  VENDOR_EMAIL_DOMAIN,
  VENDOR_ROLES,
  VENDOR_ROLES_OPTIONS,
  VENDOR_STATUS,
  VENDOR_STATUS_OPTIONS,
} from '../../../constants/vendors'

const USERNAME_RE = /^get\d{4}$/

const EMPTY_FORM = {
  nombre: '',
  papellido: '',
  sapellido: '',
  usuario: generateLocalUsername(),
  password: '',
  rol: VENDOR_DEFAULT_ROLE,
  estado: VENDOR_STATUS.ACTIVE,
}

function buildInitialForm(vendor) {
  if (!vendor) return EMPTY_FORM
  const localPart = (vendor.email ?? '').split('@')[0] ?? ''
  return {
    nombre: vendor.nombre ?? '',
    papellido: vendor.papellido ?? '',
    sapellido: vendor.sapellido ?? '',
    usuario: localPart,
    password: '',
    rol: vendor.rol ?? VENDOR_DEFAULT_ROLE,
    estado: vendor.estado ?? VENDOR_STATUS.ACTIVE,
  }
}

export function VendorFormModal({
  isOpen,
  vendor,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(() => buildInitialForm(vendor))
  const [validationError, setValidationError] = useState('')

  if (!isOpen) return null

  const isEdit = !!vendor

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegenerateUsername = () => {
    setForm((prev) => ({ ...prev, usuario: generateLocalUsername() }))
  }

  const validate = () => {
    if (!form.nombre.trim()) return 'El nombre es obligatorio.'
    if (!form.papellido.trim()) return 'El primer apellido es obligatorio.'
    if (!isEdit) {
      if (!USERNAME_RE.test(form.usuario.trim()))
        return 'El usuario debe tener el formato get1234.'
      if (!form.password) return 'La contraseña es obligatoria.'
      // if (form.password.length < 8)
      //   return 'La contraseña debe tener al menos 8 caracteres.'
    }
    if (!VENDOR_ROLES.includes(form.rol))
      return 'Selecciona un rol válido.'
    if (![VENDOR_STATUS.ACTIVE, VENDOR_STATUS.INACTIVE].includes(form.estado))
      return 'Selecciona un estado válido.'
    return ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const message = validate()
    if (message) {
      setValidationError(message)
      return
    }
    setValidationError('')
    const payload = {
      nombre: form.nombre.trim(),
      papellido: form.papellido.trim(),
      sapellido: form.sapellido.trim(),
      rol: form.rol,
      estado: form.estado,
    }
    if (!isEdit) {
      payload.username = form.usuario.trim()
      payload.password = form.password
    }
    onSubmit(payload)
  }

  const handleClose = () => {
    setValidationError('')
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
        className='relative bg-surface border border-outline rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto'
      >
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-on-background'>
            {isEdit ? 'Editar vendedor' : 'Nuevo vendedor'}
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
              htmlFor='vendor-nombre'
              className='block text-sm text-on-surface-variant mb-1'
            >
              Nombre
            </label>
            <input
              id='vendor-nombre'
              type='text'
              value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background'
              autoComplete='off'
              required
            />
          </div>

          <div>
            <label
              htmlFor='vendor-papellido'
              className='block text-sm text-on-surface-variant mb-1'
            >
              Primer apellido
            </label>
            <input
              id='vendor-papellido'
              type='text'
              value={form.papellido}
              onChange={(e) => handleChange('papellido', e.target.value)}
              className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background'
              autoComplete='off'
              required
            />
          </div>

          <div>
            <label
              htmlFor='vendor-sapellido'
              className='block text-sm text-on-surface-variant mb-1'
            >
              Segundo apellido (opcional)
            </label>
            <input
              id='vendor-sapellido'
              type='text'
              value={form.sapellido}
              onChange={(e) => handleChange('sapellido', e.target.value)}
              className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background'
              autoComplete='off'
            />
          </div>

          <div>
            <label
              htmlFor='vendor-usuario'
              className='block text-sm text-on-surface-variant mb-1'
            >
              Usuario
            </label>
            <div className='flex gap-2'>
              <input
                id='vendor-usuario'
                type='text'
                value={form.usuario}
                onChange={(e) => handleChange('usuario', e.target.value)}
                disabled={isEdit}
                placeholder='get1234'
                pattern='get\d{4}'
                className='flex-1 px-3 py-2 bg-background border border-outline rounded-md text-on-background disabled:opacity-60 disabled:cursor-not-allowed'
                autoComplete='off'
                required={!isEdit}
              />
              {!isEdit && (
                <button
                  type='button'
                  onClick={handleRegenerateUsername}
                  title='Generar nuevo usuario'
                  aria-label='Generar nuevo usuario'
                  className='px-3 py-2 border border-outline rounded-md hover:bg-surface-variant transition-colors text-on-background'
                >
                  <RefreshCw size={16} />
                </button>
              )}
            </div>
            <p className='text-xs text-on-surface-variant mt-1'>
              El correo será {form.usuario || 'getXXXX'}
              {VENDOR_EMAIL_DOMAIN}
            </p>
          </div>

          {!isEdit && (
            <div>
              <label
                htmlFor='vendor-password'
                className='block text-sm text-on-surface-variant mb-1'
              >
                Contraseña
              </label>
              <input
                id='vendor-password'
                type='password'
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background'
                autoComplete='new-password'
                required
                minLength={1}
              />
            </div>
          )}

          <div>
            <label
              htmlFor='vendor-rol'
              className='block text-sm text-on-surface-variant mb-1'
            >
              Rol
            </label>
            <select
              id='vendor-rol'
              value={form.rol}
              onChange={(e) => handleChange('rol', e.target.value)}
              className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background'
            >
              {VENDOR_ROLES_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {isEdit && (
            <div>
              <label
                htmlFor='vendor-estado'
                className='block text-sm text-on-surface-variant mb-1'
              >
                Estado
              </label>
              <select
                id='vendor-estado'
                value={form.estado}
                onChange={(e) => handleChange('estado', e.target.value)}
                className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background'
              >
                {VENDOR_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

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
            {isSubmitting
              ? 'Guardando…'
              : isEdit
                ? 'Guardar cambios'
                : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  )
}