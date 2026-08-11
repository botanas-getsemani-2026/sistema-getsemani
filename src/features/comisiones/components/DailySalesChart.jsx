import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency } from '../../../utils/currencyUtils'

const SHORT_DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function formatShortDate(value) {
  if (!value) return ''
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value))
  if (!match) return value
  const [, y, m, d] = match
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  if (Number.isNaN(date.getTime())) return value
  return `${d}/${m}`
}

function dayLabel(value) {
  if (!value) return ''
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value))
  if (!match) return value
  const [, y, m, d] = match
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  if (Number.isNaN(date.getTime())) return value
  return `${SHORT_DAY_LABELS[date.getDay()]} ${d}/${m}`
}

function formatAxis(value) {
  const num = Number(value ?? 0) / 100
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`
  return `$${num.toFixed(0)}`
}

function TooltipContent({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className='bg-surface border border-on-surface-variant/20 rounded-md p-2 text-xs shadow-lg'>
      <div className='font-semibold mb-1 text-on-background'>{dayLabel(label)}</div>
      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          className='flex items-center gap-2 text-on-surface-variant'
        >
          <span
            className='w-2 h-2 rounded-full'
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.name}:</span>
          <span className='tabular-nums text-on-background font-medium'>
            {formatCurrency(entry.value ?? 0)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function DailySalesChart({ rows, isLoading }) {
  const data = (rows ?? []).map((r) => ({
    dia: r.dia,
    total: Number(r.total_vendido ?? 0),
    ventas: Number(r.num_ventas ?? 0),
  }))

  return (
    <div className='bg-surface rounded-lg border border-on-surface-variant/10 p-4'>
      <h3 className='text-base font-semibold text-on-background mb-3'>
        Gráfica de ventas por día
      </h3>
      {isLoading && data.length === 0 ? (
        <div className='h-64 flex items-center justify-center text-on-surface-variant text-sm'>
          Cargando…
        </div>
      ) : data.length === 0 ? (
        <div className='h-64 flex items-center justify-center text-on-surface-variant text-sm'>
          Sin datos para graficar.
        </div>
      ) : (
        <ResponsiveContainer width='100%' height={280}>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='#414941' opacity={0.4} />
            <XAxis
              dataKey='dia'
              tickFormatter={formatShortDate}
              stroke='#C1C9BF'
              fontSize={11}
            />
            <YAxis
              tickFormatter={formatAxis}
              stroke='#C1C9BF'
              fontSize={11}
              width={56}
            />
            <Tooltip content={<TooltipContent />} />
            <Line
              type='monotone'
              dataKey='total'
              name='Total del día'
              stroke='#98D5A4'
              strokeWidth={2}
              dot={{ r: 3, fill: '#98D5A4' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type='monotone'
              dataKey='ventas'
              name='Núm. ventas'
              stroke='#A2CED9'
              strokeWidth={2}
              dot={{ r: 3, fill: '#A2CED9' }}
              activeDot={{ r: 5 }}
              yAxisId={0}
              hide
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
