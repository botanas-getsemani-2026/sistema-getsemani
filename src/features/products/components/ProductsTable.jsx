import { Pencil } from 'lucide-react'
import {
  PRODUCTS_STATUS,
  PRODUCT_STATUS_COLORS,
} from '../../../constants/products'
import { formatCurrency } from '../../../utils/currencyUtils'
import { Pagination } from '../../sales/components/Pagination'

const STATUS_LABELS = {
  [PRODUCTS_STATUS.ACTIVE]: 'Activo',
  [PRODUCTS_STATUS.INACTIVE]: 'Inactivo',
  [PRODUCTS_STATUS.DISCONTINUED]: 'Descontinuado',
}

export function ProductsTable({
  products,
  total,
  page,
  pageSize,
  isLoading,
  isFetching,
  onEdit,
  onPageChange,
  onPageSizeChange,
}) {
  const showLoading = isLoading && products.length === 0
  const showEmpty = !isLoading && products.length === 0

  return (
    <div className='bg-background rounded-lg border border-on-surface-variant/10 overflow-hidden flex flex-col flex-1 min-h-0'>
      <div className='overflow-auto'>
        <table className='w-full text-left text-on-background'>
          <thead className='bg-surface-variant text-on-surface-variant text-sm uppercase tracking-wide sticky top-0'>
            <tr>
              <th className='px-4 py-3 font-medium'>Código</th>
              <th className='px-4 py-3 font-medium'>Nombre</th>
              <th className='px-4 py-3 font-medium text-right'>Precio</th>
              <th className='px-4 py-3 font-medium'>Tipo</th>
              <th className='px-4 py-3 font-medium'>Estado</th>
              <th className='px-4 py-3 font-medium text-center'>Acciones</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-on-surface-variant/10'>
            {showLoading && (
              <tr>
                <td
                  colSpan={6}
                  className='px-4 py-8 text-center text-on-surface-variant'
                >
                  Cargando…
                </td>
              </tr>
            )}

            {showEmpty && (
              <tr>
                <td
                  colSpan={6}
                  className='px-4 py-8 text-center text-on-surface-variant'
                >
                  No hay productos en el catálogo.
                </td>
              </tr>
            )}

            {!showLoading &&
              !showEmpty &&
              products.map(product => (
                <tr
                  key={product.id}
                  className='hover:bg-surface-variant/40 transition-colors'
                >
                  <td className='px-4 py-3 whitespace-nowrap font-mono text-sm'>
                    {product.codigo}
                  </td>
                  <td className='px-4 py-3'>{product.nombre}</td>
                  <td className='px-4 py-3 text-right tabular-nums'>
                    {formatCurrency(product.precio)}
                  </td>
                  <td className='px-4 py-3'>
                    <span className='inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-surface-variant text-on-background'>
                      {product.es_a_granel ? 'Granel' : 'Por pieza'}
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs text-white ${
                        PRODUCT_STATUS_COLORS[product.estado] ||
                        PRODUCT_STATUS_COLORS[PRODUCTS_STATUS.ACTIVE]
                      }`}
                    >
                      {STATUS_LABELS[product.estado] || product.estado}
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex justify-center items-center gap-2'>
                      <button
                        type='button'
                        onClick={() => onEdit(product)}
                        title='Editar'
                        aria-label={`Editar ${product.nombre}`}
                        className='p-2 rounded-md hover:bg-surface-variant transition-colors text-on-background'
                      >
                        <Pencil size={16} />
                      </button>
                      {/* <button
                        type='button'
                        onClick={() => onDelete(product)}
                        title='Eliminar'
                        aria-label={`Eliminar ${product.nombre}`}
                        className='p-2 rounded-md hover:bg-red-600/20 transition-colors text-red-500'
                      >
                        <Trash2 size={16} />
                      </button> */}
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
