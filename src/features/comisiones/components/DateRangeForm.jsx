import { useState } from 'react'
import { Calendar, FileText, Search } from 'lucide-react'
import { ConfirmModal } from '../../../components/ui/ConfirmModal'

const INPUT_CLASS =
	'w-full pl-10 pr-3 py-2 bg-on-background border border-outline rounded-md text-on-primary focus:outline-none focus:ring-2 focus:ring-primary/60'

function formatDateLong(value) {
	if (!value) return ''
	const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value))
	if (!match) return value
	const [, y, m, d] = match
	return `${d}/${m}/${y}`
}

export function DateRangeForm({
	startDate,
	endDate,
	vendors,
	vendorSelected,
	onVendorSelectedChange,
	onStartDateChange,
	onEndDateChange,
	onSearch,
	isConsulting,
	onGenerate,
	isGenerating,
}) {
	const [confirmOpen, setConfirmOpen] = useState(false)

	const isValid = !!startDate && !!endDate && endDate >= startDate

	const handleGenerateClick = () => {
		if (!isValid) return
		setConfirmOpen(true)
	}

	const handleConfirm = () => {
		setConfirmOpen(false)
		onGenerate?.()
	}

	return (
		<section className='bg-surface-variant rounded-lg p-4 flex flex-col gap-3'>
			<h2 className='text-sm font-semibold text-on-background uppercase tracking-wide'>
				Rango de fechas
			</h2>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
				<label className='flex flex-col gap-1 text-sm text-on-surface-variant'>
					Fecha inicio
					<div className='relative'>
						<Calendar
							size={16}
							className='absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant'
						/>
						<input
							type='date'
							value={startDate ?? ''}
							max={endDate || undefined}
							onChange={e => onStartDateChange(e.target.value)}
							className={INPUT_CLASS}
						/>
					</div>
				</label>
				<label className='flex flex-col gap-1 text-sm text-on-surface-variant'>
					Fecha fin
					<div className='relative'>
						<Calendar
							size={16}
							className='absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant'
						/>
						<input
							type='date'
							value={endDate ?? ''}
							min={startDate || undefined}
							onChange={e => onEndDateChange(e.target.value)}
							className={INPUT_CLASS}
						/>
					</div>
				</label>
				<label className='flex flex-col gap-1 text-sm text-on-surface-variant'>
					Filtrar por vendedor
					<select   
						value={vendorSelected ?? ''}
						className='w-full pl-2 pr-3 py-2 bg-on-background border border-outline rounded-md text-on-primary focus:outline-none focus:ring-2 focus:ring-primary/60'
						onChange={e => onVendorSelectedChange?.(e.target.value || null)}
					>
						<option className='p-0' value=''>
							Todos los vendedores
						</option>
						{vendors.map(vendor => (
							<option key={vendor.id} value={vendor.id}>
								{vendor.nombre} {vendor.papellido}
							</option>
						))}
					</select>
				</label>
			</div>

			<div className='flex flex-wrap gap-2 justify-end pt-1'>
				<button
					type='button'
					onClick={onSearch}
					disabled={!isValid || isConsulting}
					className='px-4 py-2 rounded-md bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
				>
					<Search size={16} />
					{isConsulting ? 'Consultando…' : 'Consultar'}
				</button>
				<button
					type='button'
					onClick={handleGenerateClick}
					disabled={!isValid || isGenerating}
					className='px-4 py-2 rounded-md bg-secondary text-on-secondary hover:bg-secondary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
				>
					<FileText size={16} />
					{isGenerating ? 'Generando…' : 'Generar reporte'}
				</button>
			</div>

			<ConfirmModal
				isOpen={confirmOpen}
				title='Generar reporte de comisiones'
				content={`¿Generar el reporte de comisiones del ${formatDateLong(
					startDate,
				)} al ${formatDateLong(endDate)}?`}
				onClose={() => setConfirmOpen(false)}
				onConfirm={handleConfirm}
			/>
		</section>
	)
}
