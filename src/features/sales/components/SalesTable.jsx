import { formatCurrency } from '../../../utils/currencyUtils'
import { formatDate } from '../../../utils/dateUtils'
import { Pagination } from '../../../components/ui/Pagination'

export function SalesTable({
	sales,
	total,
	page,
	pageSize,
	isLoading,
	isFetching,
	filter,
	onPageChange,
	onPageSizeChange,
}) {
	const hasFilter = !!filter?.value
	const showLoading = isLoading && sales.length === 0
	const showEmpty = !isLoading && total === 0

	return (
		<div className='bg-surface rounded-lg border border-on-surface-variant/10 overflow-hidden'>
			<div className='overflow-x-auto'>
				<table className='w-full text-left text-on-background'>
					<thead className='bg-surface-variant text-on-surface-variant text-sm uppercase tracking-wide'>
						<tr>
							<th className='px-4 py-3 font-medium'>Fecha</th>
							<th className='px-4 py-3 font-medium'>Vendedor</th>
							<th className='px-4 py-3 font-medium'>Tienda</th>
							<th className='px-4 py-3 font-medium text-right'>Total</th>
							<th className='px-4 py-3 font-medium text-right'># Productos</th>
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

						{showEmpty && !hasFilter && (
							<tr>
								<td
									colSpan={5}
									className='px-4 py-8 text-center text-on-surface-variant'
								>
									Aplica un filtro para ver ventas.
								</td>
							</tr>
						)}

						{showEmpty && hasFilter && (
							<tr>
								<td
									colSpan={5}
									className='px-4 py-8 text-center text-on-surface-variant'
								>
									No hay ventas con ese filtro.
								</td>
							</tr>
						)}

						{!showLoading && !showEmpty &&
							sales.map(sale => (
								<tr
									key={sale.id}
									className='hover:bg-surface-variant/40 transition-colors'
								>
									<td className='px-4 py-3 whitespace-nowrap'>
										{formatDate(sale.date)}
									</td>
									<td
										className='px-4 py-3'
										title={sale.vendorUser ?? undefined}
									>
										{sale.vendor}
									</td>
									<td className='px-4 py-3'>
										<span className='inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-surface-variant text-on-background'>
											{sale.storeId ?? '—'}
										</span>
									</td>
									<td className='px-4 py-3 text-right tabular-nums'>
										{formatCurrency(sale.total ?? 0)}
									</td>
									<td className='px-4 py-3 text-right tabular-nums'>
										{sale.productsCount}
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
