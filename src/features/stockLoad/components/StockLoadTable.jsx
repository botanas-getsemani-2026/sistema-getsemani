import { ChevronDown, ChevronRight, Pencil, ArrowUpDown } from 'lucide-react'
import { formatCurrency } from '../../../utils/currencyUtils'

const STATUS_STYLES = {
	pendiente: 'bg-yellow-600 text-yellow-100',
	autorizada: 'bg-green-600 text-green-100',
	rechazada: 'bg-red-600 text-red-100',
}

const STATUS_LABELS = {
	pendiente: 'Pendiente',
	autorizada: 'Autorizada',
	rechazada: 'Rechazada',
}

function LoadCard({
	load,
	isExpanded,
	onToggle,
	onAuthorize,
	onReject,
	onEditProduct,
	onSortToggle,
	sortOrder,
}) {
	const isPending = load.status === 'pendiente'

	const visibleDetails = load.details.filter(d => !d._deleted)

	const sortedDetails = [...visibleDetails].sort((a, b) => {
		if (sortOrder === 'asc') {
			return a.quantity - b.quantity
		}
		return b.quantity - a.quantity
	})

	return (
		<article className='bg-surface mb-4'>
			{isPending && (
				<div className='p-3 flex justify-end gap-2'>
					<button
						type='button'
						onClick={() => onAuthorize(load.id)}
						className='px-3 py-1 bg-green-600 text-green-100 rounded-md hover:bg-green-700 text-lg focus:outline-none focus:ring-2 focus:ring-green-500'
					>
						Autorizar
					</button>
					<button
						type='button'
						onClick={() => onReject(load.id)}
						className='px-3 py-1 bg-red-600 text-red-100 rounded-md hover:bg-red-700 text-lg focus:outline-none focus:ring-2 focus:ring-red-500'
					>
						Rechazar
					</button>
				</div>
			)}
			<button
				type='button'
				aria-expanded={isExpanded}
				aria-controls={`detalles-carga-${load.id}`}
				className='w-full p-4 bg-sidebar flex justify-between items-center hover:bg-sidebar/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary text-left'
				onClick={() => onToggle(load.id)}
			>
				<div className='flex items-center gap-3'>
					<span aria-hidden='true'>
						{isExpanded ? (
							<ChevronDown size={20} />
						) : (
							<ChevronRight size={20} />
						)}
					</span>
					<div>
						<h3 className='text-lg font-semibold text-on-background'>
							Carga del día{' '}
							{new Date(load.loadDate).toLocaleDateString('es-MX', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</h3>
						<p className='text-sm text-on-surface-variant'>
							{visibleDetails.length} producto(s)
						</p>
					</div>
				</div>
				<div className='flex items-center gap-4'>
					<span
						className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLES[load.status]}`}
					>
						{STATUS_LABELS[load.status]}
					</span>
				</div>
			</button>

			{isExpanded && (
				<div className='overflow-x-auto'>
					<table className='w-full border border-outline'>
						<thead>
							<tr className='border-b border-outline'>
								<th className='px-4 py-3 text-center text-2xl font-medium text-on-surface-variant'>
									Código
								</th>
								<th className='px-4 py-3 text-center text-2xl font-medium text-on-surface-variant'>
									Producto
								</th>
								<th className='px-4 py-3 text-center text-2xl font-medium text-on-surface-variant'>
									<button
										onClick={e => {
											e.stopPropagation()
											onSortToggle()
										}}
										className='flex items-center gap-1 hover:text-on-background'
									>
										Cantidad
										<ArrowUpDown size={14} />
									</button>
								</th>
                <th className='px-4 py-3 text-center text-2xl font-medium text-on-surface-variant'>
                  Tipo
                </th>
								<th className='px-4 py-3 text-center text-2xl font-medium text-on-surface-variant'>
									Precio Unitario
								</th>
								<th className='px-4 py-3 text-center text-2xl font-medium text-on-surface-variant'>
									Total
								</th>
								{isPending && (
									<th className='px-4 py-3 text-center text-2xl font-medium text-on-surface-variant'>
										Opciones
									</th>
								)}
							</tr>
						</thead>
						<tbody>
							{sortedDetails.map(detail => (
								<tr
									key={detail.id}
									className='border-b border-outline hover:bg-background/50'
								>
									<td className='px-4 py-3 text-lg text-on-background text-center'>
										{detail.product?.codigo}
									</td>
									<td className='px-4 py-3 text-lg text-on-background text-center'>
										{detail.product?.nombre}
									</td>
									<td className='px-4 py-3 text-lg text-on-background text-center'>
										{detail.quantity}
									</td>
                  <td className='px-4 py-3 text-lg text-on-background text-center'>
                    {detail.product?.es_a_granel ? 'A granel' : 'Unidad'}
                  </td>
									<td className='px-4 py-3 text-lg text-on-background text-center'>
										{formatCurrency(detail.product?.precio)}
									</td>
									<td className='px-4 py-3 text-lg text-on-background text-center'>
										{formatCurrency(detail.quantity * detail.product?.precio)}
									</td>
									<td className='px-4 py-3 text-center'>
										<div className='flex justify-center gap-2'>
											{isPending && (
												<button
													onClick={() => onEditProduct(load.id, detail)}
													className='p-2 rounded-md hover:bg-primary/20 transition-colors text-primary'
													title='Editar'
												>
													<Pencil size={16} />
												</button>
											)}
											{/* <button
                        onClick={() => onRemoveProduct(load.id, detail.id)}
                        className="p-2 rounded-md hover:bg-error/20 transition-colors text-error"
                        title="Eliminar"
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
			)}
		</article>
	)
}

export function StockLoadTable({
	vendor,
	loads,
	expandedLoadId,
	sortOrder,
	onToggleExpand,
	onAuthorize,
	onReject,
	onEditProduct,
	onRemoveProduct,
	onSortToggle,
}) {
	if (!vendor || !loads) return null

	return (
		<section className='space-y-4'>
			<section className='p-4 bg-surface-variant rounded-lg'>
				<h2 className='text-xl font-bold text-on-background'>
					{vendor.nombre} {vendor.papellido} {vendor.sapellido || ''}
				</h2>
				<p className='text-medium text-on-surface-variant'>
					Usuario: {vendor.email.split('@')[0]}
				</p>
			</section>

			{loads.map(load => (
				<LoadCard
					key={load.id}
					load={load}
					isExpanded={expandedLoadId === load.id}
					sortOrder={sortOrder}
					onToggle={onToggleExpand}
					onAuthorize={onAuthorize}
					onReject={onReject}
					onEditProduct={onEditProduct}
					onRemoveProduct={onRemoveProduct}
					onSortToggle={onSortToggle}
				/>
			))}
		</section>
	)
}
