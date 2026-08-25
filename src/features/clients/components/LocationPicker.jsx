import { MapPin } from 'lucide-react'

const INPUT_CLASS =
  'w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background'

export function LocationPicker({
  direccion,
  latitud,
  longitud,
  onDireccionChange,
  onLatitudChange,
  onLongitudChange,
  disabled = false,
}) {
  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <label className='block text-sm text-on-surface-variant'>
          Ubicación
        </label>
        <button
          type='button'
          disabled
          title='Próximamente'
          aria-label='Seleccionar ubicación en mapa (próximamente)'
          className='inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border border-outline text-on-surface-variant opacity-60 cursor-not-allowed'
        >
          <MapPin size={14} />
          Seleccionar en mapa
        </button>
      </div>

      <div>
        <label
          htmlFor='client-direccion'
          className='block text-sm text-on-surface-variant mb-1'
        >
          Dirección
        </label>
        <input
          id='client-direccion'
          type='text'
          value={direccion ?? ''}
          onChange={(e) => onDireccionChange(e.target.value)}
          placeholder='Calle, número, colonia, ciudad'
          disabled={disabled}
          className={INPUT_CLASS}
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div>
          <label
            htmlFor='client-latitud'
            className='block text-sm text-on-surface-variant mb-1'
          >
            Latitud
          </label>
          <input
            id='client-latitud'
            type='text'
            value={latitud ?? ''}
            onChange={(e) => onLatitudChange(e.target.value)}
            placeholder='Ej. 19.4326'
            disabled={disabled}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label
            htmlFor='client-longitud'
            className='block text-sm text-on-surface-variant mb-1'
          >
            Longitud
          </label>
          <input
            id='client-longitud'
            type='text'
            value={longitud ?? ''}
            onChange={(e) => onLongitudChange(e.target.value)}
            placeholder='Ej. -99.1332'
            disabled={disabled}
            className={INPUT_CLASS}
          />
        </div>
      </div>
    </div>
  )
}
