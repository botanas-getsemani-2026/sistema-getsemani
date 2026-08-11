import { CheckCircle2, Trash2 } from 'lucide-react'
import {
  PERIOD_STATUS,
  PERIOD_STATUS_COLORS,
  PERIOD_STATUS_LABELS,
} from '../../../constants/comisiones'

function formatShortDate(value) {
  if (!value) return '—'
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value))
  if (!match) return value
  const [, y, m, d] = match
  return `${d}/${m}/${y}`
}

function statusBadge(status) {
  const color = PERIOD_STATUS_COLORS[status] ?? 'bg-surface-variant'
  const label = PERIOD_STATUS_LABELS[status] ?? status
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs text-white ${color}`}
    >
      {label}
    </span>
  )
}

export function PeriodsHistoryList({
  periods,
  isLoading,
  onMarkPaid,
  onDelete,
  busyId,
}) {
  const showLoading = isLoading && (!periods || periods.length === 0)
  const showEmpty = !isLoading && (!periods || periods.length === 0)

  return (
    <div className='bg-surface rounded-lg border border-on-surface-variant/10 overflow-hidden'>
      <div className='px-4 py-3 border-b border-on-surface-variant/10'>
        <h3 className='text-base font-semibold text-on-background'>
          Periodos generados
        </h3>
        <p className='text-xs text-on-surface-variant mt-0.5'>
          Historial de reportes de comisiones que se han generado.
        </p>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left text-on-background'>
          <thead className='bg-surface-variant text-on-surface-variant text-xs uppercase tracking-wide'>
            <tr>
              <th className='px-4 py-3 font-medium'>Fecha inicio</th>
              <th className='px-4 py-3 font-medium'>Fecha fin</th>
              <th className='px-4 py-3 font-medium'>Estado</th>
              <th className='px-4 py-3 font-medium text-right'>Acciones</th>
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
                  Aún no se han generado reportes de comisiones.
                </td>
              </tr>
            )}
            {!showLoading &&
              !showEmpty &&
              periods.map((period) => {
                const isPaid = period.estado === PERIOD_STATUS.PAID
                const isBusy = busyId === period.id
                console.log('isBusy', busyId)
                return (
                  <tr
                    key={period.id}
                    className='hover:bg-surface-variant/40 transition-colors'
                  >
                    <td className='px-4 py-3 whitespace-nowrap'>
                      {formatShortDate(period.fecha_inicio)}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap'>
                      {formatShortDate(period.fecha_fin)}
                    </td>
                    <td className='px-4 py-3'>{statusBadge(period.estado)}</td>
                    <td className='px-4 py-3'>
                      <div className='flex justify-end gap-2'>
                        <button
                          type='button'
                          onClick={() => onMarkPaid(period)}
                          disabled={isPaid || isBusy}
                          title={
                            isPaid
                              ? 'Periodo ya pagado'
                              : 'Marcar como pagado'
                          }
                          className='p-2 rounded-md hover:bg-surface-variant disabled:opacity-40 disabled:cursor-not-allowed text-primary'
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          type='button'
                          onClick={() => onDelete(period)}
                          disabled={isPaid || isBusy}
                          title={
                            isPaid
                              ? 'No se puede eliminar un periodo pagado'
                              : 'Eliminar periodo'
                          }
                          className='p-2 rounded-md hover:bg-surface-variant disabled:opacity-40 disabled:cursor-not-allowed text-error'
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
