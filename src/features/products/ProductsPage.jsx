import { Package } from 'lucide-react'
import { useState } from 'react'
import { ToastContainer } from '../../components/ui/Toast'
import { PRODUCT_TYPE_FILTER } from '../../constants/products'
import { useToast } from '../../core/hooks/useToast'
import { ProductFormModal } from './components/ProductFormModal'
import { ProductsFilters } from './components/ProductsFilters'
import { ProductsTable } from './components/ProductsTable'
import {
  useCreateProductMutation,
  useUpdateProductMutation
} from './data/mutations'
import { useProducts } from './data/products'

export function ProductsPage() {
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(50)

	const [searchTerm, setSearchTerm] = useState('')
	const [typeFilter, setTypeFilter] = useState(PRODUCT_TYPE_FILTER.ALL)
	const [statusFilter, setStatusFilter] = useState('todos')

	const filters = { searchTerm, typeFilter, statusFilter }
	const { products, total, isLoading, isFetching } = useProducts(
		filters,
		page,
		pageSize,
	)

	const { toasts, removeToast, success } = useToast()

	const [formOpen, setFormOpen] = useState(false)
	const [editingProduct, setEditingProduct] = useState(null)
	const [formError, setFormError] = useState('')

	const createMutation = useCreateProductMutation()
	const updateMutation = useUpdateProductMutation()

	const isSubmittingForm = createMutation.isPending || updateMutation.isPending

	const handleSearchChange = value => {
		setSearchTerm(value)
		setPage(1)
	}

	const handleTypeFilterChange = value => {
		setTypeFilter(value)
		setPage(1)
	}

	const handleStatusFilterChange = value => {
		setStatusFilter(value)
		setPage(1)
	}

	const handlePageSizeChange = size => {
		setPageSize(size)
		setPage(1)
	}

	const handleNew = () => {
		setEditingProduct(null)
		setFormError('')
		setFormOpen(true)
	}

	const handleEdit = product => {
		setEditingProduct(product)
		setFormError('')
		setFormOpen(true)
	}

	// const handleDelete = product => {
	// 	setDeletingProduct(product)
	// 	setDeleteOpen(true)
	// }

	const handleSubmitForm = async payload => {
		setFormError('')
		try {
			if (editingProduct) {
				await updateMutation.mutateAsync({ id: editingProduct.id, ...payload })
				success(`Producto "${payload.nombre}" actualizado correctamente.`)
			} else {
				await createMutation.mutateAsync(payload)
				success(`Producto "${payload.nombre}" creado correctamente.`)
			}
			setFormOpen(false)
			setEditingProduct(null)
		} catch (err) {
			setFormError(mapMutationError(err))
		}
	}

	return (
		<section className='p-6 space-y-6 h-full flex flex-col overflow-hidden'>
			<header className='flex items-center gap-3'>
				<Package className='text-primary' size={28} />
				<h1 className='text-2xl font-bold text-on-background'>Productos</h1>
			</header>

			<ProductsFilters
				searchTerm={searchTerm}
				typeFilter={typeFilter}
				statusFilter={statusFilter}
				onSearchChange={handleSearchChange}
				onTypeFilterChange={handleTypeFilterChange}
				onStatusFilterChange={handleStatusFilterChange}
				onNewProduct={handleNew}
			/>

			<ProductsTable
				products={products}
				total={total}
				page={page}
				pageSize={pageSize}
				isLoading={isLoading}
				isFetching={isFetching}
				onEdit={handleEdit}
				onPageChange={setPage}
				onPageSizeChange={handlePageSizeChange}
			/>

			<ProductFormModal
        key={editingProduct?.id ?? `new-${formOpen}`}
				isOpen={formOpen}
				product={editingProduct}
				isSubmitting={isSubmittingForm}
				errorMessage={formError}
				onClose={() => {
					setFormOpen(false)
					setEditingProduct(null)
					setFormError('')
				}}
				onSubmit={handleSubmitForm}
			/>

			<ToastContainer toasts={toasts} onClose={removeToast} />
		</section>
	)
}

function mapMutationError(err) {
	if (!err) return 'Error desconocido.'
	const code = err.code
	if (code === '23505') {
		return 'Ya existe un producto con ese código.'
	}
	if (code === '23514') {
		return 'El estado seleccionado no es válido.'
	}
	return err.message || 'No se pudo guardar el producto.'
}
