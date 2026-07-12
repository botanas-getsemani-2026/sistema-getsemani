import { Plus, Save } from 'lucide-react'
import { useState } from 'react'
import { ToastContainer } from '../../components/ui/Toast'
import { useAllProducts } from '../../core/services/products'
import { useCurrentUser, useUsers } from '../../core/services/users'
import { AddProductModal } from './components/AddProductModal'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { ProductEditModal } from './components/ProductEditModal'
import { RejectModal } from './components/RejectModal'
import { StockLoadFilters } from './components/StockLoadFilters'
import { StockLoadTable } from './components/StockLoadTable'
import { useLoadsQueries } from './data/loads'
import {
	useAuthorizeLoadMutation,
	useRejectLoadMutation,
	useSaveLoadDetailsMutation,
} from './data/mutations'
import { useToast } from '../../core/hooks/useToast'
import { useSupabaseContext } from '../../core/providers/hooks/useSupabase'

export function StockLoadPage() {
	const { data: users } = useUsers()
  const { user } = useSupabaseContext()
	const { data: currentUser } = useCurrentUser(user?.id)
	const { data: products = [] } = useAllProducts()

	const { toasts, removeToast, success, warning, error } = useToast()

	const [selectedVendor, setSelectedVendor] = useState(null)
	const [selectedDate, setSelectedDate] = useState('')
	const { vendorData, loading, refetch } = useLoadsQueries(
		selectedVendor?.id,
		selectedDate,
	)

	const [localLoads, setLocalLoads] = useState(null)
	const [expandedLoadId, setExpandedLoadId] = useState(null)
	const [hasChanges, setHasChanges] = useState(false)
	const [sortOrder, setSortOrder] = useState('desc')

	const [editModalOpen, setEditModalOpen] = useState(false)
	const [editingProduct, setEditingProduct] = useState(null)
	const [addModalOpen, setAddModalOpen] = useState(false)
	const [rejectModalOpen, setRejectModalOpen] = useState(false)
	const [selectedLoadId, setSelectedLoadId] = useState(null)
	const [rejectMotivo, setRejectMotivo] = useState('')
	const [confirmModalOpen, setConfirmModalOpen] = useState(false)

	const authorizeMutation = useAuthorizeLoadMutation()
	const rejectMutation = useRejectLoadMutation()
	const saveMutation = useSaveLoadDetailsMutation()

	const handleSearch = async () => {
		if (!selectedVendor || !selectedDate) {
			warning('Selecciona un vendedor y una fecha')
			return
		}

		const { data, error: searchError } = await refetch()

		if (data && data.loads.length === 0) {
			warning('No hay cargas disponibles para este vendedor y fecha')
		}

		if (searchError) {
			error('Error al cargar las cargas')
		}

		if (data) setLocalLoads(JSON.parse(JSON.stringify(data)))

		setHasChanges(false)
	}

	const handleToggleExpand = loadId => {
		setExpandedLoadId(prev => (prev === loadId ? null : loadId))
	}

	const handleAuthorize = async loadId => {
		if (!currentUser) {
			error('No se pudo obtener el usuario actual')
			return
		}

		try {
			await authorizeMutation.mutateAsync({
				loadId,
				userId: currentUser.id,
			})
			success('Carga autorizada correctamente')
			const { data } = await refetch()

			if (data) setLocalLoads(JSON.parse(JSON.stringify(data)))
		} catch {
			error('Error al autorizar la carga')
		}
	}

	const handleReject = loadId => {
		setSelectedLoadId(loadId)
		setRejectMotivo('')
		setRejectModalOpen(true)
	}

	const handleConfirmReject = async () => {
		if (!currentUser) {
			error('No se pudo obtener el usuario actual')
			return
		}

		if (!rejectMotivo.trim()) {
			warning('Ingresa el motivo del rechazo')
			return
		}

		try {
			await rejectMutation.mutateAsync({
				loadId: selectedLoadId,
				motivo: rejectMotivo,
				userId: currentUser.id,
			})
			success('Carga rechazada correctamente')
			setRejectModalOpen(false)
			setSelectedLoadId(null)
			setRejectMotivo('')
			const { data } = await refetch()
			if (data) setLocalLoads(JSON.parse(JSON.stringify(data)))
		} catch {
			error('Error al rechazar la carga')
		}
	}

	const handleEditProduct = (loadId, detail) => {
		setSelectedLoadId(loadId)
		setEditingProduct(detail)
		setEditModalOpen(true)
	}

	// const handleRemoveDetail = (loadId, detailId) => {
	//   console.log('Eliminar detalle:', { loadId, detailId })

	// 	setLocalLoads(prev => {
	// 		const updated = prev ? { ...prev } : null
	// 		if (updated) {
	// 			const loadIndex = updated.loads.findIndex(l => l.id === loadId)
	// 			if (loadIndex !== -1) {
	// 				updated.loads[loadIndex] = {
	// 					...updated.loads[loadIndex],
	// 					details: updated.loads[loadIndex].details.map(d =>
	// 						d.id === detailId ? { ...d, _deleted: true } : d
	// 					),
	// 				}

	//         console.log('Carga actualizada para eliminación', updated)
	// 			}
	// 		}
	// 		return updated
	// 	})
	// 	setHasChanges(true)
	// 	warning('Producto eliminado. Guarda los cambios para aplicar.')
	// }

	const handleSaveDetail = (detailId, newQuantity) => {
		setLocalLoads(prev => {
			const updated = prev ? { ...prev } : null
			if (updated) {
				updated.loads = updated.loads.map(load => ({
					...load,
					details: load.details.map(d =>
						d.id === detailId ? { ...d, quantity: newQuantity } : d,
					),
				}))
			}
			return updated
		})
		setHasChanges(true)
		success('Producto actualizado. Guarda los cambios para aplicar.')
		setEditModalOpen(false)
		setEditingProduct(null)
	}

	const handleAddProduct = (productId, quantity) => {
		const productToAdd = products.find(p => p.id === productId)
		// console.log('Producto a agregar:', productToAdd)

		console.log('Cargas actuales (bd):', vendorData)
		if (!productToAdd) return

		setLocalLoads(prev => {
			// const updated = prev ? { ...prev } : { ...vendorData }
			const updated = structuredClone(prev ?? vendorData)
			const loadId = expandedLoadId
			const loadIndex = updated.loads.findIndex(l => l.id === loadId)
			console.log('loadIndex:', loadIndex, 'loadId:', loadId)
			if (loadIndex !== -1) {
				const newDetail = {
					id: `temp-${Date.now()}`,
					loadId,
					productId,
					product: productToAdd,
					quantity,
					totalPrice: quantity * productToAdd.precio,
					_isNew: true,
				}
				updated.loads[loadIndex] = {
					...updated.loads[loadIndex],
					details: [...updated.loads[loadIndex].details, newDetail],
				}
			}
			return updated
		})
		setHasChanges(true)
		success('Producto agregado. Guarda los cambios para aplicar.')
		setAddModalOpen(false)
	}

	const handleSaveLoad = () => {
		setConfirmModalOpen(true)
	}

	const handleSortToggle = () => {
		setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
	}

	const handleConfirmModal = async () => {
		if (!localLoads || !expandedLoadId) return

		const currentLoad = localLoads.loads.find(l => l.id === expandedLoadId)
		if (!currentLoad) return

		const detailsToSave = currentLoad.details.filter(d => !d._deleted)
		const detailsToDelete = currentLoad.details.filter(d => d._deleted)

		try {
			await saveMutation.mutateAsync({
				loadId: expandedLoadId,
				details: [
					...detailsToSave,
					...detailsToDelete.map(d => ({ ...d, _deleted: true })),
				],
			})
			success('Carga guardada correctamente')
			setHasChanges(false)
			setConfirmModalOpen(false)
			const { data } = await refetch()
			if (data) setLocalLoads(JSON.parse(JSON.stringify(data)))
		} catch {
			error('Error al guardar la carga')
		}
	}

	const displayData = localLoads || vendorData

	return (
		<div className='p-6 space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-on-background'>Cargas.</h1>
				{hasChanges && (
					<button
						onClick={handleSaveLoad}
						className='flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary/90 transition-colors text-lg'
					>
						<Save size={18} />
						Guardar carga
					</button>
				)}
			</div>

			<StockLoadFilters
				vendors={users}
				selectedVendor={selectedVendor}
				selectedDate={selectedDate}
				onVendorChange={vendor => {
					setSelectedVendor(vendor)
					setHasChanges(false)
					setLocalLoads(null)
				}}
				onDateChange={date => {
					setSelectedDate(date)
					setHasChanges(false)
					setLocalLoads(null)
				}}
				onSearch={handleSearch}
			/>

			{displayData && displayData.loads.length > 0 && (
				<div className='flex justify-end gap-2'>
					<button
						onClick={() => setAddModalOpen(true)}
						className='flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary/90 transition-colors text-lg'
					>
						<Plus size={18} />
						Agregar Producto
					</button>
					<button
						onClick={handleSortToggle}
						className='px-4 py-2 bg-surface-variant text-on-background rounded-md hover:bg-surface-variant/80 transition-colors text-lg'
					>
						Ordenar {sortOrder === 'asc' ? '↑' : '↓'}
					</button>
				</div>
			)}

			{displayData && localLoads?.loads.length > 0 && (
				<StockLoadTable
					vendor={displayData.vendor}
					loads={localLoads?.loads}
					expandedLoadId={expandedLoadId}
					sortOrder={sortOrder}
					onToggleExpand={handleToggleExpand}
					onAuthorize={handleAuthorize}
					onReject={handleReject}
					onEditProduct={handleEditProduct}
					// onRemoveProduct={handleRemoveDetail} --- IGNORE ---
					onSortToggle={handleSortToggle}
				/>
			)}

			{!displayData && (
				<div className='flex flex-col items-center justify-center py-12 text-on-surface-variant'>
					<p className='text-lg'>
						Selecciona un vendedor y una fecha para buscar cargas.
					</p>
				</div>
			)}

			{loading && (
				<div className='flex justify-center py-12'>
					<p className='text-on-surface-variant'>Cargando...</p>
				</div>
			)}

			{editModalOpen && (
				<ProductEditModal
					key={editingProduct?.id}
					detail={editingProduct}
					isOpen={editModalOpen}
					onClose={() => {
						setEditModalOpen(false)
						setEditingProduct(null)
					}}
					onSave={handleSaveDetail}
				/>
			)}

			{confirmModalOpen && (
				<ConfirmModal
					title='Confirmar'
					content='¿Estás seguro de que deseas guardar esta carga?'
					isOpen={confirmModalOpen}
					onClose={() => setConfirmModalOpen(false)}
					onConfirm={handleConfirmModal}
					toast={{ error, success, warning }}
				/>
			)}

			<AddProductModal
				isOpen={addModalOpen}
				onClose={() => setAddModalOpen(false)}
				onAdd={handleAddProduct}
				products={products}
				currentDetails={
					displayData?.loads
						.find(l => l.id === expandedLoadId)
						?.details.filter(d => !d._deleted) || []
				}
			/>

			<RejectModal
				isOpen={rejectModalOpen}
				motivo={rejectMotivo}
				onMotivoChange={setRejectMotivo}
				onClose={() => {
					setRejectModalOpen(false)
					setSelectedLoadId(null)
					setRejectMotivo('')
				}}
				onReject={handleConfirmReject}
			/>

			<ToastContainer toasts={toasts} onClose={removeToast} />
		</div>
	)
}
