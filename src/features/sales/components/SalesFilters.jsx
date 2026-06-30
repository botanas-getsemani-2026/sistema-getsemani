import { formatUser } from '../../../utils/formatUser'

export function SalesFilters({
	vendors,
	selectedFilterType,
	selectedFilterValue,
	onFilterTypeChange,
	onFilterValueChange
}) {
	return (
		<section className='flex flex-col bg-surface-variant rounded-lg p-4 gap-4'>
			<h2 className='text-lg font-semibold text-on-background'>Filtros</h2>
			<div className='flex items-center h-full gap-4'>
				<div className='bg-card'>
					<select
						name='filters'
						className='bg-background text-on-background border border-border p-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-sm'
						value={selectedFilterType}
						onChange={e => onFilterTypeChange(e.target.value)}
					>
						<option value=''>Seleccione una opción</option>
						<option value='fecha'>fecha</option>
						<option value='vendedor'>vendedor</option>
						<option value='tienda'>tienda</option>
					</select>
				</div>

				{selectedFilterType === 'fecha' && (
					<div className='flex items-center justify-center gap-2 w-full h-full'>
						<label className='flex items-center text-sm w-full text-on-surface-variant gap-1'>
							Desde
							<input
								className='px-3 py-2 bg-on-background border border-outline rounded-md text-on-primary w-full'
								type='date'
								value={selectedFilterValue?.from ?? ''}
								onChange={e =>
									onFilterValueChange({
										...(selectedFilterValue ?? {}),
										from: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex items-center text-sm w-full text-on-surface-variant gap-1'>
							Hasta
							<input
								className='px-3 py-2 bg-on-background border border-outline rounded-md text-on-primary w-full'
								type='date'
								value={selectedFilterValue?.to ?? ''}
								min={selectedFilterValue?.from || undefined}
								onChange={e =>
									onFilterValueChange({
										...(selectedFilterValue ?? {}),
										to: e.target.value,
									})
								}
							/>
						</label>
					</div>
				)}
				{selectedFilterType === 'vendedor' && (
					<select
						className='w-full px-3 py-2 bg-on-background border border-outline rounded-sm text-on-primary'
						value={selectedFilterValue || ''}
						onChange={e => {
							const id = e.target.value
							const { id: vendorId } = vendors.find(v => v.id === id)
							onFilterValueChange(vendorId)
						}}
					>
						<option value=''>Seleccione un vendedor.</option>
						{vendors.map(vendor => (
							<option key={vendor.id} value={vendor.id}>
								{vendor.nombre} {vendor.papellido} ({formatUser(vendor.email)})
							</option>
						))}
					</select>
				)}
				{selectedFilterType === 'tienda' && (
					<input
						className='px-3 py-2 bg-on-background border w-full border-outline rounded-md'
						type='text'
						value={selectedFilterValue}
						onChange={e => onFilterValueChange(e.target.value.toLowerCase())}
						placeholder='Ingrese el código de la tienda'
					/>
				)}
			</div>
		</section>
	)
}
