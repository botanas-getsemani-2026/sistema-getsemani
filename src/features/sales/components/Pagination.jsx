import {
	ChevronFirst,
	ChevronLast,
	ChevronLeft,
	ChevronRight,
	Loader2,
} from 'lucide-react'

export function Pagination({
	page,
	pageSize,
	total,
	pageSizeOptions = [50, 75, 100],
	isFetching = false,
	onPageChange,
	onPageSizeChange,
}) {
	const lastPage = Math.max(1, Math.ceil(total / pageSize))
	const from = total === 0 ? 0 : (page - 1) * pageSize + 1
	const to = Math.min(page * pageSize, total)
	const isFirst = page <= 1
	const isLast = page >= lastPage

	if (total === 0) return null

	return (
		<div
			className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-on-background ${
				isFetching ? 'opacity-70' : ''
			}`}
		>
			<div className='flex items-center gap-2'>
				<label htmlFor='page-size' className='text-sm text-on-surface-variant'>
					Por página
				</label>
				<select
					id='page-size'
					value={pageSize}
					onChange={e => onPageSizeChange(Number(e.target.value))}
					className='bg-surface-variant text-on-background rounded-md px-2 py-1 text-sm border border-on-surface-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/60'
				>
					{pageSizeOptions.map(opt => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>
				{isFetching && (
					<Loader2
						className='size-4 animate-spin text-primary'
						aria-label='Cargando'
					/>
				)}
			</div>

			<div className='text-sm text-on-surface-variant'>
				Mostrando {from} - {to} de {total}
			</div>

			<div className='flex items-center gap-1'>
				<button
					type='button'
					title='Primera página'
					aria-label='Primera página'
					disabled={isFirst}
					onClick={() => onPageChange(1)}
					className='p-2 rounded-md hover:bg-surface-variant disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
				>
					<ChevronFirst className='size-4' />
				</button>
				<button
					type='button'
					title='Página anterior'
					aria-label='Página anterior'
					disabled={isFirst}
					onClick={() => onPageChange(page - 1)}
					className='p-2 rounded-md hover:bg-surface-variant disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
				>
					<ChevronLeft className='size-4' />
				</button>

				<span className='px-3 text-sm tabular-nums'>
					{page} / {lastPage}
				</span>

				<button
					type='button'
					title='Página siguiente'
					aria-label='Página siguiente'
					disabled={isLast}
					onClick={() => onPageChange(page + 1)}
					className='p-2 rounded-md hover:bg-surface-variant disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
				>
					<ChevronRight className='size-4' />
				</button>
				<button
					type='button'
					title='Última página'
					aria-label='Última página'
					disabled={isLast}
					onClick={() => onPageChange(lastPage)}
					className='p-2 rounded-md hover:bg-surface-variant disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
				>
					<ChevronLast className='size-4' />
				</button>
			</div>
		</div>
	)
}
