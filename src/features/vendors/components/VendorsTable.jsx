import { Pencil } from 'lucide-react'
import {
  VENDOR_ROLES_OPTIONS,
  VENDOR_STATUS,
  VENDOR_STATUS_COLORS,
  VENDOR_STATUS_OPTIONS,
} from '../../../constants/vendors'
import { Pagination } from '../../../components/ui/Pagination'

const STATUS_LABELS = VENDOR_STATUS_OPTIONS.reduce((acc, opt) => {
  acc[opt.value] = opt.label
  return acc
}, {})

const ROLE_LABELS = VENDOR_ROLES_OPTIONS.reduce((acc, opt) => {
  acc[opt.value] = opt.label
  return acc
}, {})

function fullName(vendor) {
  return [vendor.nombre, vendor.papellido, vendor.sapellido]
    .map((s) => (s ?? '').trim())
    .filter(Boolean)
    .join(' ')
}

export function VendorsTable({
  vendors,
  total,
  page,
  pageSize,
  isLoading,
  isFetching,
  onEdit,
  onPageChange,
  onPageSizeChange,
}) {
  const showLoading = isLoading && vendors.length === 0
  const showEmpty = !isLoading && vendors.length === 0

  return (
    <div className='bg-background rounded-lg border border-on-surface-variant/10 overflow-hidden flex flex-col flex-1 min-h-0'>
      <div className='overflow-auto'>
        <table className='w-full text-left text-on-background'>
          <thead className='bg-surface-variant text-on-surface-variant text-sm uppercase tracking-wide sticky top-0'>
            <tr>
              <th className='px-4 py-3 font-medium'>Nombre completo</th>
              <th className='px-4 py-3 font-medium'>Email</th>
              <th className='px-4 py-3 font-medium'>Rol</th>
              <th className='px-4 py-3 font-medium'>Estado</th>
              <th className='px-4 py-3 font-medium text-center'>Acciones</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-on-surface-variant/10'>
            {showLoading && (
              <tr>
                <td
                  colSpan={5}
                  className='px-4 py-8 text-center text-on-surface-variant'
                >
                  Cargando…
                </td>
              </tr>
            )}

            {showEmpty && (
              <tr>
                <td
                  colSpan={5}
                  className='px-4 py-8 text-center text-on-surface-variant'
                >
                  No hay vendedores en el catálogo.
                </td>
              </tr>
            )}

            {!showLoading &&
              !showEmpty &&
              vendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  className='hover:bg-surface-variant/40 transition-colors'
                >
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {fullName(vendor) || '—'}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-sm'>
                    {vendor.email}
                  </td>
                  <td className='px-4 py-3'>
                    <span className='inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-surface-variant text-on-background'>
                      {ROLE_LABELS[vendor.rol] ?? vendor.rol ?? '—'}
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs text-white ${
                        VENDOR_STATUS_COLORS[vendor.estado] ||
                        VENDOR_STATUS_COLORS[VENDOR_STATUS.ACTIVE]
                      }`}
                    >
                      {STATUS_LABELS[vendor.estado] ?? vendor.estado}
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex justify-center items-center gap-2'>
                      <button
                        type='button'
                        onClick={() => onEdit(vendor)}
                        title='Editar'
                        aria-label={`Editar ${fullName(vendor)}`}
                        className='p-2 rounded-md hover:bg-surface-variant transition-colors text-on-background'
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        isFetching={isFetching}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}