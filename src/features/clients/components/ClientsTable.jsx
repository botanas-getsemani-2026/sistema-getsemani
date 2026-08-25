import { Pencil, Trash2 } from 'lucide-react'
import {
  CLIENT_PAGE_SIZE_OPTIONS,
} from '../../../constants/clients'
import { Pagination } from '../../../components/ui/Pagination'

function vendorFullName(profile) {
  if (!profile) return '—'
  const parts = [profile.nombre, profile.papellido, profile.sapellido]
    .map((s) => (s ?? '').trim())
    .filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : '—'
}

export function ClientsTable({
  clients,
  total,
  page,
  pageSize,
  isLoading,
  isFetching,
  onEdit,
  onDelete,
  onPageChange,
  onPageSizeChange,
}) {
  const showLoading = isLoading && clients.length === 0
  const showEmpty = !isLoading && clients.length === 0

  return (
    <div className='bg-background rounded-lg border border-on-surface-variant/10 overflow-hidden flex flex-col flex-1 min-h-0'>
      <div className='overflow-auto'>
        <table className='w-full text-left text-on-background'>
          <thead className='bg-surface-variant text-on-surface-variant text-sm uppercase tracking-wide sticky top-0'>
            <tr>
              <th className='px-4 py-3 font-medium'>Código</th>
              <th className='px-4 py-3 font-medium'>Nombre</th>
              <th className='px-4 py-3 font-medium'>Dueño</th>
              <th className='px-4 py-3 font-medium'>Teléfono</th>
              <th className='px-4 py-3 font-medium'>Vendedor</th>
              <th className='px-4 py-3 font-medium text-center'>Crédito</th>
              <th className='px-4 py-3 font-medium text-center'>Acciones</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-on-surface-variant/10'>
            {showLoading && (
              <tr>
                <td
                  colSpan={7}
                  className='px-4 py-8 text-center text-on-surface-variant'
                >
                  Cargando…
                </td>
              </tr>
            )}

            {showEmpty && (
              <tr>
                <td
                  colSpan={7}
                  className='px-4 py-8 text-center text-on-surface-variant'
                >
                  No hay clientes registrados.
                </td>
              </tr>
            )}

            {!showLoading &&
              !showEmpty &&
              clients.map((client) => (
                <tr
                  key={client.id}
                  className='hover:bg-surface-variant/40 transition-colors'
                >
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <span className='inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-surface-variant text-on-background'>
                      {client.id}
                    </span>
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {client.nombre_tienda || '—'}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {client.dueno || '—'}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-sm'>
                    {client.telefono || '—'}
                  </td>
                  <td
                    className='px-4 py-3'
                    title={client.perfiles?.email ?? undefined}
                  >
                    {vendorFullName(client.perfiles)}
                  </td>
                  <td className='px-4 py-3 text-center'>
                    {client.tiene_credito ? (
                      <span className='inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-primary/30 text-primary'>
                        Sí
                      </span>
                    ) : (
                      <span className='inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-surface-variant text-on-surface-variant'>
                        No
                      </span>
                    )}
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex justify-center items-center gap-2'>
                      <button
                        type='button'
                        onClick={() => onEdit(client)}
                        title='Editar'
                        aria-label={`Editar ${client.nombre_tienda ?? client.id}`}
                        className='p-2 rounded-md hover:bg-surface-variant transition-colors text-on-background'
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type='button'
                        onClick={() => onDelete(client)}
                        title='Eliminar'
                        aria-label={`Eliminar ${client.nombre_tienda ?? client.id}`}
                        className='p-2 rounded-md hover:bg-surface-variant transition-colors text-error'
                      >
                        <Trash2 size={16} />
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
        pageSizeOptions={CLIENT_PAGE_SIZE_OPTIONS}
        isFetching={isFetching}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
