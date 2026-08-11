import { formatCurrency } from '../../../utils/currencyUtils'

const SHORT_DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function formatShortDate(value) {
  if (!value) return '—'
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value))
  if (!match) return value
  const [, y, m, d] = match
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  if (Number.isNaN(date.getTime())) return value
  const dayLabel = SHORT_DAY_LABELS[date.getDay()]
  return `${dayLabel} ${d}/${m}`
}

export function DailySalesTable({ rows, isLoading }) {
  const hasRows = Array.isArray(rows) && rows.length > 0
  const showLoading = isLoading && !hasRows
  const showEmpty = !isLoading && !hasRows

  const totalCents = (rows ?? []).reduce(
    (acc, r) => acc + Number(r.total_vendido ?? 0),
    0,
  )
  const totalSales = (rows ?? []).reduce(
    (acc, r) => acc + Number(r.num_ventas ?? 0),
    0,
  )

  return (
    <div className='bg-surface rounded-lg border border-on-surface-variant/10 overflow-hidden'>
      <div className='px-4 py-3 border-b border-on-surface-variant/10 flex items-center justify-between'>
        <h3 className='text-base font-semibold text-on-background'>
          Ventas por día
        </h3>
        <span className='text-xs px-2 py-0.5 rounded-md bg-surface-variant text-on-background'>
          Todos los vendedores
        </span>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left text-on-background'>
          <thead className='bg-surface-variant text-on-surface-variant text-xs uppercase tracking-wide'>
            <tr>
              <th className='px-4 py-3 font-medium'>Fecha</th>
              <th className='px-4 py-3 font-medium text-right'>Total vendido</th>
              <th className='px-4 py-3 font-medium text-right'>Núm. ventas</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-on-surface-variant/10'>
            {showLoading && (
              <tr>
                <td
                  colSpan={3}
                  className='px-4 py-8 text-center text-on-surface-variant'
                >
                  Cargando…
                </td>
              </tr>
            )}
            {showEmpty && (
              <tr>
                <td
                  colSpan={3}
                  className='px-4 py-8 text-center text-on-surface-variant'
                >
                  Sin datos para el rango seleccionado.
                </td>
              </tr>
            )}
            {!showLoading &&
              !showEmpty &&
              rows.map((row) => (
                <tr
                  key={row.dia}
                  className='hover:bg-surface-variant/40 transition-colors'
                >
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {formatShortDate(row.dia)}
                  </td>
                  <td className='px-4 py-3 text-right tabular-nums'>
                    {formatCurrency(row.total_vendido ?? 0)}
                  </td>
                  <td className='px-4 py-3 text-right tabular-nums'>
                    {row.num_ventas ?? 0}
                  </td>
                </tr>
              ))}
          </tbody>
          {!showEmpty && (
            <tfoot>
              <tr className='bg-surface-variant/40 font-semibold text-primary'>
                <td className='px-4 py-3 uppercase text-xs tracking-wide'>
                  Total del periodo
                </td>
                <td className='px-4 py-3 text-right tabular-nums'>
                  {formatCurrency(totalCents)}
                </td>
                <td className='px-4 py-3 text-right tabular-nums'>
                  {totalSales}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
