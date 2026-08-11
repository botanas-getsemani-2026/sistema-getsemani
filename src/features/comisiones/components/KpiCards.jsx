import { DollarSign, Users, BarChart3 } from 'lucide-react'
import { formatCurrency } from '../../../utils/currencyUtils'

const CARD_STYLE =
	'bg-surface rounded-lg border border-on-surface-variant/10 p-4 flex items-center gap-4'

const ICON_WRAP =
	'w-12 h-12 rounded-lg flex items-center justify-center shrink-0'

export function KpiCards({ totalCents, vendorCount, dailyAverageCents, excludedProductsTotal}) {
	return (
		<section className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
			<article className={CARD_STYLE}>
				<div className={`${ICON_WRAP} bg-primary/20`}>
					<BarChart3 className='text-primary' size={24} />
				</div>
				<div className='flex flex-col'>
					<span className='text-xs uppercase tracking-wide text-on-surface-variant'>
						Total del periodo
					</span>
					<span className='text-2xl font-bold text-on-background tabular-nums'>
						{formatCurrency(totalCents)}
					</span>
					<span className='text-xs text-on-surface-variant'>
						Promedio por día: {formatCurrency(dailyAverageCents)}
					</span>
				</div>
			</article>

			<article className={CARD_STYLE}>
				<div className={`${ICON_WRAP} bg-primary/20`}>
					<BarChart3 className='text-primary' size={24} />
				</div>
				<div className='flex flex-col'>
					<span className='text-xs uppercase tracking-wide text-on-surface-variant'>
						Productos excluidos
					</span>
					<span className='text-2xl font-bold text-on-background tabular-nums'>
						{formatCurrency(excludedProductsTotal)}
					</span>
				</div>
			</article>

			<article className={CARD_STYLE}>
				<div className={`${ICON_WRAP} bg-tertiary/20`}>
					<DollarSign className='text-tertiary' size={24} />
				</div>
				<div className='flex flex-col'>
					<span className='text-xs uppercase tracking-wide text-on-surface-variant'>
						Ventas generales
					</span>
					<span className='text-2xl font-bold text-on-background tabular-nums'>
						{formatCurrency(totalCents)}
					</span>
					<span className='text-xs text-on-surface-variant'>
						Suma de ventas del rango
					</span>
				</div>
			</article>

			<article className={CARD_STYLE}>
				<div className={`${ICON_WRAP} bg-secondary/20`}>
					<Users className='text-secondary' size={24} />
				</div>
				<div className='flex flex-col'>
					<span className='text-xs uppercase tracking-wide text-on-surface-variant'>
						Vendedores activos
					</span>
					<span className='text-2xl font-bold text-on-background tabular-nums'>
						{vendorCount}
					</span>
					<span className='text-xs text-on-surface-variant'>
						Con ventas en el periodo
					</span>
				</div>
			</article>
		</section>
	)
}
