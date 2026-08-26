import { Users } from 'lucide-react'
import { useState } from 'react'
import { ToastContainer } from '../../components/ui/Toast'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { VENDOR_STATUS_FILTER } from '../../constants/vendors'
import { useToast } from '../../core/hooks/useToast'
import { useUsersPaginated } from '../../core/services/users'
import { VendorsFilters } from './components/VendorsFilters'
import { VendorsTable } from './components/VendorsTable'
import { VendorFormModal } from './components/VendorFormModal'
import {
  useCreateVendorMutation,
  useUpdateVendorMutation,
} from './data/mutations'

export function VendorsPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [statusFilter, setStatusFilter] = useState(VENDOR_STATUS_FILTER.ALL)

  const [formOpen, setFormOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState(null)
  const [formError, setFormError] = useState('')

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingPayload, setPendingPayload] = useState(null)

  const filters = { searchName, searchEmail, statusFilter }
  const { users, total, isLoading, isFetching } = useUsersPaginated(
    filters,
    page,
    pageSize,
  )

  const { toasts, removeToast, success } = useToast()

  const createMutation = useCreateVendorMutation()
  const updateMutation = useUpdateVendorMutation()
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleSearchNameChange = (value) => {
    setSearchName(value)
    setPage(1)
  }

  const handleSearchEmailChange = (value) => {
    setSearchEmail(value)
    setPage(1)
  }

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value)
    setPage(1)
  }

  const handlePageSizeChange = (size) => {
    setPageSize(size)
    setPage(1)
  }

  const handleNew = () => {
    setEditingVendor(null)
    setFormError('')
    setFormOpen(true)
  }

  const handleEdit = (vendor) => {
    setEditingVendor(vendor)
    setFormError('')
    setFormOpen(true)
  }

  const handleSubmitForm = (payload) => {
    setPendingPayload(payload)
    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!pendingPayload) return
    try {
      if (editingVendor) {
        await updateMutation.mutateAsync({
          id: editingVendor.id,
          ...pendingPayload,
        })
        success(`Vendedor "${pendingPayload.nombre}" actualizado correctamente.`)
      } else {
        await createMutation.mutateAsync(pendingPayload)
        success(`Vendedor "${pendingPayload.nombre}" creado correctamente.`)
      }
      setConfirmOpen(false)
      setPendingPayload(null)
      setFormOpen(false)
      setEditingVendor(null)
    } catch (err) {
      setConfirmOpen(false)
      
      if (err.code === 'USER_EXISTS') {
        setFormError('El usuario generado ya existe, regenera el usuario e intenta de nuevo.')
        return
      }
      setFormError(err?.message ?? 'No se pudo guardar el vendedor.')
    }
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setEditingVendor(null)
    setFormError('')
  }

  const confirmTitle = editingVendor
    ? 'Guardar cambios'
    : 'Crear vendedor'

  const confirmContent = editingVendor
    ? `¿Guardar los cambios del vendedor "${editingVendor.nombre}"?`
    : `¿Crear el vendedor "${pendingPayload?.nombre ?? ''}" con usuario "${pendingPayload?.username ?? ''}"?`

  return (
    <section className='p-6 space-y-6 h-full flex flex-col overflow-hidden'>
      <header className='flex items-center gap-3'>
        <Users className='text-primary' size={28} />
        <h1 className='text-2xl font-bold text-on-background'>Vendedores</h1>
      </header>

      <VendorsFilters
        searchName={searchName}
        searchEmail={searchEmail}
        statusFilter={statusFilter}
        onSearchNameChange={handleSearchNameChange}
        onSearchEmailChange={handleSearchEmailChange}
        onStatusFilterChange={handleStatusFilterChange}
        onNewVendor={handleNew}
      />

      <VendorsTable
        vendors={users}
        total={total}
        page={page}
        pageSize={pageSize}
        isLoading={isLoading}
        isFetching={isFetching}
        onEdit={handleEdit}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />

      <VendorFormModal
        key={editingVendor?.id ?? `new-${formOpen}`}
        isOpen={formOpen}
        vendor={editingVendor}
        isSubmitting={isSubmitting}
        errorMessage={formError}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title={confirmTitle}
        content={confirmContent}
        isPending={isSubmitting}
        onClose={() => {
          setConfirmOpen(false)
        }}
        onConfirm={handleConfirm}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </section>
  )
}