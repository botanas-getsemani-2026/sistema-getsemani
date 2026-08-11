import { formatCurrency } from '../../../utils/currencyUtils'

const VENDOR_INITIAL_COLORS = [
  'bg-primary/70',
  'bg-tertiary/70',
  'bg-secondary/70',
  'bg-on-tertiary-container/70',
  'bg-on-primary-container/70',
  'bg-on-secondary-container/70',
]

const MIN_DRIFT_THRESHOLD = 0.01

function extractInitials(name) {
  if (!name) return '?'
  const parts = String(name).trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : parts[0]?.[1] ?? ''
  return (first + last).toUpperCase()
}

function indexOfMaxValue(values) {
  let maxIdx = 0
  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[maxIdx]) maxIdx = i
  }
  return maxIdx
}

export function VendorSummaryTable({ rows, isLoading }) {
  const hasRows = Array.isArray(rows) && rows.length > 0
  const showLoading = isLoading && !hasRows
  const showEmpty = !isLoading && !hasRows

  const vendorRows = rows ?? []

  const grandTotalCents = vendorRows.reduce(
    (acc, vendor) => acc + Number(vendor.total ?? 0),
    0,
  )

  const exactPercentages = vendorRows.map(vendor => {
    const totalCents = Number(vendor.total ?? 0)
    return grandTotalCents > 0 ? (totalCents / grandTotalCents) * 100 : 0
  })

  const displayPercentages = exactPercentages.map(p => Number(p.toFixed(2)))

  const displayedPercentagesSum = displayPercentages.reduce(
    (acc, p) => acc + p,
    0,
  )

  const percentageDrift = Number((100 - displayedPercentagesSum).toFixed(2))

  if (grandTotalCents > 0 && Math.abs(percentageDrift) >= MIN_DRIFT_THRESHOLD) {
    const largestShareIndex = indexOfMaxValue(displayPercentages)
    displayPercentages[largestShareIndex] = Number(
      (displayPercentages[largestShareIndex] + percentageDrift).toFixed(2),
    )
  }

  const totalParticipationPercent = displayPercentages.reduce(
    (acc, p) => acc + p,
    0,
  )

  return (
    <div className='bg-surface rounded-lg border border-on-surface-variant/10 overflow-hidden'>
      <div className='px-4 py-3 border-b border-on-surface-variant/10 flex items-center justify-between'>
        <h3 className='text-base font-semibold text-on-background'>
          Resumen del periodo por vendedor
        </h3>
        <span className='text-xs px-2 py-0.5 rounded-md bg-tertiary-container text-on-tertiary-container'>
          Todos los vendedores
        </span>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left text-on-background'>
          <thead className='bg-surface-variant text-on-surface-variant text-xs uppercase tracking-wide'>
            <tr>
              <th className='px-4 py-3 font-medium'>Vendedor</th>
              <th className='px-4 py-3 font-medium text-right'>Total vendido</th>
              <th className='px-4 py-3 font-medium w-40'>% Participación</th>
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
                  Sin vendedores con ventas en este rango.
                </td>
              </tr>
            )}
            {!showLoading &&
              !showEmpty &&
              vendorRows.map((vendor, vendorIndex) => {
                const totalCents = Number(vendor.total ?? 0)
                const participationPercent = displayPercentages[vendorIndex]
                const avatarColorClass =
                  VENDOR_INITIAL_COLORS[
                    vendorIndex % VENDOR_INITIAL_COLORS.length
                  ]
                return (
                  <tr
                    key={vendor.vendedor}
                    className='hover:bg-surface-variant/40 transition-colors'
                  >
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-3'>
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-on-primary ${avatarColorClass}`}
                        >
                          {extractInitials(vendor.vendedor)}
                        </span>
                        <span className='text-on-background'>
                          {vendor.vendedor}
                        </span>
                      </div>
                    </td>
                    <td className='px-4 py-3 text-right tabular-nums'>
                      {formatCurrency(totalCents)}
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-2'>
                        <div className='flex-1 h-1.5 bg-surface-variant rounded-full overflow-hidden'>
                          <div
                            className='h-full bg-primary'
                            style={{
                              width: `${participationPercent.toFixed(2)}%`,
                            }}
                          />
                        </div>
                        <span className='text-md text-on-surface-variant tabular-nums w-12 text-right'>
                          {participationPercent.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
          </tbody>
          {!showEmpty && (
            <tfoot>
              <tr className='bg-surface-variant/40 font-semibold text-primary'>
                <td className='px-4 py-3 uppercase text-xs tracking-wide'>
                  Total
                </td>
                <td className='px-4 py-3 text-right tabular-nums'>
                  {formatCurrency(grandTotalCents)}
                </td>
                <td className='px-4 py-3 text-right text-xs tabular-nums'>
                  {totalParticipationPercent.toFixed(2)}%
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
