import { Plus, Search } from 'lucide-react'
import { formatUser } from '../../../utils/formatUser'

export function ClientsFilters({
  vendors,
  searchDraft,
  vendorDraft,
  onSearchDraftChange,
  onVendorDraftChange,
  onSearch,
  onNewClient,
}) {
  return (
    <div className='flex flex-wrap gap-4 p-4 bg-surface-variant rounded-lg items-end'>
      <div className='flex-1 min-w-60'>
        <label
          htmlFor='client-search'
          className='block text-sm text-on-surface-variant mb-1'
        >
          Buscar por código o nombre
        </label>
        <div className='relative'>
          <Search
            className='absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant'
            size={18}
          />
          <input
            id='client-search'
            type='text'
            value={searchDraft}
            onChange={(e) => onSearchDraftChange(e.target.value)}
            placeholder='Ej. GT-QR-00042 o Mi tienda'
            className='w-full px-3 py-2 pl-10 bg-on-background border border-outline rounded-md text-on-primary'
          />
        </div>
      </div>

      <div className='flex-1 min-w-60'>
        <label
          htmlFor='client-vendor-filter'
          className='block text-sm text-on-surface-variant mb-1'
        >
          Vendedor que lo registró
        </label>
        <select
          id='client-vendor-filter'
          value={vendorDraft}
          onChange={(e) => onVendorDraftChange(e.target.value)}
          className='w-full px-3 py-2 bg-on-background border border-outline rounded-md text-on-primary'
        >
          <option value=''>Todos los vendedores</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.nombre} {vendor.papellido} ({formatUser(vendor.email)})
            </option>
          ))}
        </select>
      </div>

      <div className='flex items-end gap-2'>
        <button
          type='button'
          onClick={onSearch}
          className='px-4 py-2 border border-outline text-on-background rounded-md hover:bg-surface-variant/80 transition-colors flex items-center gap-2'
        >
          <Search size={18} />
          Buscar
        </button>
        <button
          type='button'
          onClick={onNewClient}
          className='px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2'
        >
          <Plus size={18} />
          Nuevo cliente
        </button>
      </div>
    </div>
  )
}
