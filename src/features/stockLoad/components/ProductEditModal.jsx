import { X } from 'lucide-react'
import { useState } from 'react'
import { formatCurrency } from '../../../utils/currencyUtils'

export function ProductEditModal({ detail, isOpen, onClose, onSave, toast }) {
	const [cantidad, setCantidad] = useState(detail?.quantity)

	console.log('Cantidad:', cantidad, 'Detail.quantity:', detail?.quantity)
	const isBulk = detail?.product?.es_a_granel

	if (!isOpen || !detail) return null

	const precioUnitario = detail.product?.precio || 0
	const precioTotal = cantidad * precioUnitario

	const handleSave = () => {
		const number = isBulk ? parseFloat(cantidad) : parseInt(cantidad)
		if (!number || number <= 0) {
			toast.error('Cantidad inválida')
			return;
		}
		onSave(detail.id, cantidad)
		onClose()
	}

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center'>
			<div className='absolute inset-0 bg-black/50' onClick={onClose} />
			<div className='relative bg-surface border border-outline rounded-lg shadow-xl w-full max-w-md p-6'>
				<div className='flex justify-between items-center mb-4'>
					<h3 className='text-lg font-semibold text-on-background'>
						Editar Producto
					</h3>
					*
					<button
						onClick={onClose}
						className='p-1 rounded hover:bg-surface-variant transition-colors'
					>
						<X size={20} />
					</button>
				</div>

				<div className='space-y-4'>
					<div>
						<label className='block text-sm text-on-surface-variant mb-1'>
							Código del producto
						</label>
						<input
							type='text'
							value={detail.product?.codigo || ''}
							readOnly
							className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background opacity-60'
						/>
					</div>

					<div>
						<label className='block text-sm text-on-surface-variant mb-1'>
							Nombre del producto
						</label>
						<input
							type='text'
							value={detail.product?.nombre || ''}
							readOnly
							className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background opacity-60'
						/>
					</div>

					<div>
						<label className='block text-sm text-on-surface-variant mb-1'>
							Cantidad
						</label>
						<input
							type='text'
							inputMode={isBulk ? 'decimal' : 'numeric'}
							value={cantidad}
							onChange={e => {
								const value = e.target.value
								const pattern = isBulk ? /^\d*\.?\d*$/ : /^\d*$/
								if (value === '' || pattern.test(value)) {
									setCantidad(value)
								}
							}}
							className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background'
						/>
					</div>

					<div>
						<label className='block text-sm text-on-surface-variant mb-1'>
							Precio Unitario
						</label>
						<input
							type='text'
							value={formatCurrency(precioUnitario)}
							readOnly
							className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background opacity-60'
						/>
					</div>

					<div>
						<label className='block text-sm text-on-surface-variant mb-1'>
							Precio Total
						</label>
						<input
							type='text'
							value={formatCurrency(precioTotal)}
							readOnly
							className='w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background font-semibold'
						/>
					</div>
				</div>

				<div className='flex gap-3 mt-6'>
					<button
						onClick={onClose}
						className='flex-1 px-4 py-2 border border-outline rounded-md hover:bg-surface-variant transition-colors text-on-background'
					>
						Cancelar
					</button>
					<button
						onClick={handleSave}
						className='flex-1 px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary/90 transition-colors'
					>
						Guardar
					</button>
				</div>
			</div>
		</div>
	)
}
