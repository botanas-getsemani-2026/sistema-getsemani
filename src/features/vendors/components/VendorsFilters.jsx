import { Plus, Search } from 'lucide-react'
import { VENDOR_STATUS_FILTER_OPTIONS } from '../../../constants/vendors'

export function VendorsFilters({
  searchName,
  searchEmail,
  statusFilter,
  onSearchNameChange,
  onSearchEmailChange,
  onStatusFilterChange,
  onNewVendor,
}) {
  return (
    <div className='flex flex-wrap gap-4 p-4 bg-surface-variant rounded-lg items-end'>
      <div className='flex-1 min-w-50'>
        <label
          htmlFor='vendor-search-name'
          className='block text-sm text-on-surface-variant mb-1'
        >
          Buscar por nombre
        </label>
        <div className='relative'>
          <Search
            className='absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant'
            size={18}
          />
          <input
            id='vendor-search-name'
            type='text'
            value={searchName}
            onChange={(e) => onSearchNameChange(e.target.value)}
            placeholder='Nombre o apellido'
            className='w-full px-3 py-2 pl-10 bg-on-background border border-outline rounded-md text-on-primary'
          />
        </div>
      </div>

      <div className='flex-1 min-w-50'>
        <label
          htmlFor='vendor-search-email'
          className='block text-sm text-on-surface-variant mb-1'
        >
          Buscar por email
        </label>
        <div className='relative'>
          <Search
            className='absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant'
            size={18}
          />
          <input
            id='vendor-search-email'
            type='email'
            value={searchEmail}
            onChange={(e) => onSearchEmailChange(e.target.value)}
            placeholder='correo@ejemplo.com'
            className='w-full px-3 py-2 pl-10 bg-on-background border border-outline rounded-md text-on-primary'
          />
        </div>
      </div>

      <div className='flex-1 min-w-40'>
        <label
          htmlFor='vendor-status-filter'
          className='block text-sm text-on-surface-variant mb-1'
        >
          Estado
        </label>
        <select
          id='vendor-status-filter'
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className='w-full px-3 py-2 bg-on-background border border-outline rounded-md text-on-primary'
        >
          {VENDOR_STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className='flex items-end'>
        <button
          type='button'
          onClick={onNewVendor}
          className='px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2'
        >
          <Plus size={18} />
          Nuevo usuario
        </button>
      </div>
    </div>
  )
}