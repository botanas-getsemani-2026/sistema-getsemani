import { formatCurrency } from '../../../utils/currencyUtils'
import { buildDailyVendorPivot } from '../data/pivot'

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

export function VendorDailyPivotTable({ rows, isLoading }) {
  const hasRows = Array.isArray(rows) && rows.length > 0
  const showLoading = isLoading && !hasRows
  const showEmpty = !isLoading && !hasRows

  const { days, vendors, cells, dayTotals, grandTotal } =
    buildDailyVendorPivot(rows ?? [])

  return (
    <div className='bg-surface rounded-lg border border-on-surface-variant/10 overflow-auto'>
      <div className='px-4 py-3 border-b border-on-surface-variant/10'>
        <h3 className='text-base font-semibold text-on-background'>
          Detalle de ventas por vendedor por día
        </h3>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left text-on-background'>
          <thead className='bg-surface-variant text-on-surface-variant text-xs uppercase tracking-wide'>
            <tr>
              <th className='px-3 py-3 font-medium sticky left-0 bg-surface-variant z-10'>
                Vendedor
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className='px-3 py-2 font-medium text-right min-w-24'
                >
                  <div>{formatShortDate(day)}</div>
                  <div className='text-[10px] font-normal text-on-surface-variant/70'>
                    Total día
                  </div>
                </th>
              ))}
              <th className='px-3 py-3 font-medium text-right text-primary min-w-28'>
                Total periodo
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-on-surface-variant/10'>
            {showLoading && (
              <tr>
                <td
                  colSpan={days.length + 2}
                  className='px-4 py-8 text-center text-on-surface-variant'
                >
                  Cargando…
                </td>
              </tr>
            )}
            {showEmpty && (
              <tr>
                <td
                  colSpan={days.length + 2}
                  className='px-4 py-8 text-center text-on-surface-variant'
                >
                  Sin detalle para el rango seleccionado.
                </td>
              </tr>
            )}
            {!showLoading &&
              !showEmpty &&
              vendors.map((vendor) => {
                const vendorTotal = days.reduce(
                  (acc, day) => acc + (cells[vendor]?.[day] ?? 0),
                  0,
                )
                return (
                  <tr
                    key={vendor}
                    className='hover:bg-surface-variant/40 transition-colors'
                  >
                    <td className='px-3 py-3 whitespace-nowrap sticky left-0 bg-surface'>
                      {vendor}
                    </td>
                    {days.map((day) => (
                      <td
                        key={day}
                        className='px-3 py-3 text-right tabular-nums'
                      >
                        {formatCurrency(cells[vendor]?.[day] ?? 0)}
                      </td>
                    ))}
                    <td className='px-3 py-3 text-right tabular-nums text-primary font-semibold'>
                      {formatCurrency(vendorTotal)}
                    </td>
                  </tr>
                )
              })}
          </tbody>
          {!showEmpty && (
            <tfoot>
              <tr className='bg-surface-variant/40 font-semibold text-primary'>
                <td className='px-3 py-3 uppercase text-xs tracking-wide sticky left-0 bg-surface-variant/40'>
                  Total del día
                </td>
                {days.map((day) => (
                  <td key={day} className='px-3 py-3 text-right tabular-nums'>
                    {formatCurrency(dayTotals[day] ?? 0)}
                  </td>
                ))}
                <td className='px-3 py-3 text-right tabular-nums'>
                  {formatCurrency(grandTotal)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
