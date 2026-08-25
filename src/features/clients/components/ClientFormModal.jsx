import { RefreshCw, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSupabaseClient } from '../../../core/providers/hooks/useSupabase'
import { CLIENT_CREDIT_OPTIONS } from '../../../constants/clients'
import {
  checkClientCodeExists,
  generateUniqueClientCode,
} from '../data/queries'
import { LocationPicker } from './LocationPicker'

const COORDINATE_RE = /^-?\d+(\.\d+)?$/

const EMPTY_FORM = {
  id: '',
  id_usuario: '',
  nombre_tienda: '',
  dueno: '',
  telefono: '',
  direccion: '',
  latitud: '',
  longitud: '',
  detalles: '',
  tiene_credito: 'false',
}

function buildInitialForm(client) {
  if (!client) return { ...EMPTY_FORM }
  return {
    id: client.id ?? '',
    id_usuario: client.id_usuario ?? '',
    nombre_tienda: client.nombre_tienda ?? '',
    dueno: client.dueno ?? '',
    telefono: client.telefono ?? '',
    direccion: client.direccion ?? '',
    latitud: client.latitud ?? '',
    longitud: client.longitud ?? '',
    detalles: client.detalles ?? '',
    tiene_credito:
      client.tiene_credito === true
        ? 'true'
        : client.tiene_credito === false
          ? 'false'
          : 'false',
  }
}

function isValidCoordinate(value) {
  if (value === '' || value === null || value === undefined) return false
  return COORDINATE_RE.test(String(value).trim())
}

export function ClientFormModal({
  isOpen,
  client,
  vendors,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}) {
  const supabase = useSupabaseClient()
  const [form, setForm] = useState(() => buildInitialForm(client))
  const [validationError, setValidationError] = useState('')
  const [codeStatus, setCodeStatus] = useState(() =>
    client ? 'ready' : 'generating',
  )
  const isEdit = !!client

  useEffect(() => {
    if (client) return

    let cancelled = false
    generateUniqueClientCode(supabase)
      .then((code) => {
        if (cancelled) return
        setForm((prev) => ({ ...prev, id: code }))
        setCodeStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setCodeStatus('error')
        setValidationError(err?.message ?? 'No se pudo generar el código.')
      })

    return () => {
      cancelled = true
    }
  }, [client, supabase])

  if (!isOpen) return null

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegenerateCode = async () => {
    setCodeStatus('generating')
    setValidationError('')
    try {
      const code = await generateUniqueClientCode(supabase)
      setForm((prev) => ({ ...prev, id: code }))
      setCodeStatus('ready')
    } catch (err) {
      setCodeStatus('error')
      setValidationError(err?.message ?? 'No se pudo regenerar el código.')
    }
  }

  const handleVerifyCode = async () => {
    const candidate = form.id.trim()
    if (!candidate) {
      setValidationError('El código es obligatorio.')
      return
    }
    try {
      const exists = await checkClientCodeExists(supabase, candidate)
      if (exists) {
        setValidationError('El código ya existe. Regenera e intenta de nuevo.')
      } else {
        setValidationError('')
      }
    } catch (err) {
      setValidationError(err?.message ?? 'No se pudo verificar el código.')
    }
  }

  const validate = () => {
    if (!form.id.trim()) return 'El código es obligatorio.'
    if (!form.id_usuario) return 'Selecciona el vendedor responsable.'
    if (!form.nombre_tienda.trim()) return 'El nombre es obligatorio.'
    if (!form.dueno.trim()) return 'El dueño es obligatorio.'
    if (!form.telefono.trim()) return 'El teléfono es obligatorio.'
    if (!form.direccion.trim()) return 'La dirección es obligatoria.'
    if (!isValidCoordinate(form.latitud))
      return 'La latitud debe ser un número válido.'
    if (!isValidCoordinate(form.longitud))
      return 'La longitud debe ser un número válido.'
    if (
      form.tiene_credito !== 'true' &&
      form.tiene_credito !== 'false'
    ) {
      return 'Selecciona si es apto para crédito.'
    }
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
      id: form.id.trim(),
      id_usuario: form.id_usuario,
      nombre_tienda: form.nombre_tienda.trim(),
      dueno: form.dueno.trim(),
      telefono: form.telefono.trim(),
      direccion: form.direccion.trim(),
      latitud: form.latitud.trim(),
      longitud: form.longitud.trim(),
      detalles: form.detalles.trim(),
      tiene_credito: form.tiene_credito === 'true',
    }
    onSubmit(payload)
  }

  const handleClose = () => {
    setValidationError('')
    onClose()
  }

  const visibleError = validationError || errorMessage
  const isCodeBusy = codeStatus === 'generating'
  const canSubmit = !isSubmitting && !isCodeBusy && codeStatus !== 'error'

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/50'
        onClick={handleClose}
        aria-hidden='true'
      />
      <form
        onSubmit={handleSubmit}
        className='relative bg-surface border border-outline rounded-lg shadow-xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto'
      >
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-on-background'>
            {isEdit ? 'Editar cliente' : 'Nuevo cliente'}
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
              htmlFor='client-id'
              className='block text-sm text-on-surface-variant mb-1'
            >
              Código
            </label>
            <div className='flex gap-2'>
              <input
                id='client-id'
                type='text'
                value={form.id}
                onChange={(e) => handleChange('id', e.target.value)}
                onBlur={!isEdit ? handleVerifyCode : undefined}
                disabled={isEdit}
                placeholder='GT-QR-00000'
                className='flex-1 px-3 py-2 bg-background border border-outline rounded-md text-on-background disabled:opacity-60 disabled:cursor-not-allowed'
                required
              />
              {!isEdit && (
                <button
                  type='button'
                  onClick={handleRegenerateCode}
                  disabled={isCodeBusy}
                  title='Regenerar código'
                  aria-label='Regenerar código'
                  className='px-3 py-2 border border-outline rounded-md hover:bg-surface-variant transition-colors text-on-background disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <RefreshCw
                    size={16}
                    className={isCodeBusy ? 'animate-spin' : ''}
                  />
                </button>
              )}
            </div>
            {!isEdit && (
              <p className='text-xs text-on-surface-variant mt-1'>
                {isCodeBusy
                  ? 'Generando código único…'
                  : 'El código se genera automáticamente y se verifica que no exista.'}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='client-id-usuario'
              className='block text-sm text-on-surface-variant mb-1'
            >
              Vendedor responsable
            </label>
            <select
              id='client-id-usuario'
              value={form.id_usuario}
              onChange={(e) => handleChange('id_usuario', e.target.value)}
              className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background'
              required
            >
              <option value=''>Selecciona un vendedor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.nombre} {vendor.papellido}
                </option>
              ))}
            </select>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='client-nombre'
                className='block text-sm text-on-surface-variant mb-1'
              >
                Nombre de la tienda
              </label>
              <input
                id='client-nombre'
                type='text'
                value={form.nombre_tienda}
                onChange={(e) => handleChange('nombre_tienda', e.target.value)}
                className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background'
                required
              />
            </div>

            <div>
              <label
                htmlFor='client-dueno'
                className='block text-sm text-on-surface-variant mb-1'
              >
                Dueño
              </label>
              <input
                id='client-dueno'
                type='text'
                value={form.dueno}
                onChange={(e) => handleChange('dueno', e.target.value)}
                className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background'
                required
              />
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='client-telefono'
                className='block text-sm text-on-surface-variant mb-1'
              >
                Teléfono
              </label>
              <input
                id='client-telefono'
                type='text'
                value={form.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background'
                required
              />
            </div>

            <div>
              <label
                htmlFor='client-credito'
                className='block text-sm text-on-surface-variant mb-1'
              >
                Apto para crédito
              </label>
              <select
                id='client-credito'
                value={form.tiene_credito}
                onChange={(e) => handleChange('tiene_credito', e.target.value)}
                className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background'
                required
              >
                {CLIENT_CREDIT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <LocationPicker
            direccion={form.direccion}
            latitud={form.latitud}
            longitud={form.longitud}
            onDireccionChange={(value) => handleChange('direccion', value)}
            onLatitudChange={(value) => handleChange('latitud', value)}
            onLongitudChange={(value) => handleChange('longitud', value)}
          />

          <div>
            <label
              htmlFor='client-detalles'
              className='block text-sm text-on-surface-variant mb-1'
            >
              Detalles (opcional)
            </label>
            <textarea
              id='client-detalles'
              rows={3}
              value={form.detalles}
              onChange={(e) => handleChange('detalles', e.target.value)}
              className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background resize-none'
            />
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
            disabled={isSubmitting}
            className='flex-1 px-4 py-2 border border-outline rounded-md hover:bg-surface-variant transition-colors text-on-background disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Cancelar
          </button>
          <button
            type='submit'
            disabled={!canSubmit}
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
