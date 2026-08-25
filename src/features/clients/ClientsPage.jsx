import { Store } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { ToastContainer } from '../../components/ui/Toast'
import { CLIENT_DEFAULT_PAGE_SIZE } from '../../constants/clients'
import { useToast } from '../../core/hooks/useToast'
import { useCurrentUser, useUsers } from '../../core/services/users'
import { ClientsFilters } from './components/ClientsFilters'
import { ClientsTable } from './components/ClientsTable'
import { ClientFormModal } from './components/ClientFormModal'
import {
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from './data/mutations'
import { useClientsPaginated } from './data/queries'
import { CLIENT_ERROR_CODES } from './data/mutations'

export function ClientsPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(CLIENT_DEFAULT_PAGE_SIZE)

  const [searchDraft, setSearchDraft] = useState('')
  const [vendorDraft, setVendorDraft] = useState('')
  const [searchApplied, setSearchApplied] = useState('')
  const [vendorApplied, setVendorApplied] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [formError, setFormError] = useState('')

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingPayload, setPendingPayload] = useState(null)
  const [confirmMode, setConfirmMode] = useState('create')
  const [deletingClient, setDeletingClient] = useState(null)

  const { data: users = [] } = useUsers()
  const { data: currentUser } = useCurrentUser()
  const { toasts, removeToast, success, error: errorToast } = useToast()

  const vendorId = useMemo(() => {
    if (!vendorApplied) return null
    const match = users.find((u) => u.id === vendorApplied)
    return match?.id ?? null
  }, [vendorApplied, users])

  const filters = useMemo(
    () => ({ search: searchApplied, id_usuario: vendorId }),
    [searchApplied, vendorId],
  )

  const { clients, total, isLoading, isFetching } = useClientsPaginated(
    filters,
    page,
    pageSize,
  )

  const createMutation = useCreateClientMutation()
  const updateMutation = useUpdateClientMutation()
  const deleteMutation = useDeleteClientMutation()
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleSearch = () => {
    setSearchApplied(searchDraft.trim())
    setVendorApplied(vendorDraft)
    setPage(1)
  }

  const handlePageSizeChange = (size) => {
    setPageSize(size)
    setPage(1)
  }

  const handleNew = () => {
    setEditingClient(null)
    setFormError('')
    setFormOpen(true)
  }

  const handleEdit = (client) => {
    setEditingClient(client)
    setFormError('')
    setFormOpen(true)
  }

  const handleDelete = (client) => {
    setDeletingClient(client)
    setConfirmMode('delete')
    setConfirmOpen(true)
  }

  const handleSubmitForm = (payload) => {
    setPendingPayload(payload)
    setConfirmMode(editingClient ? 'edit' : 'create')
    setConfirmOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setEditingClient(null)
    setFormError('')
  }

  const handleConfirm = async () => {
    if (confirmMode === 'delete') {
      if (!deletingClient) return
      try {
        await deleteMutation.mutateAsync(deletingClient.id)
        success(`Cliente "${deletingClient.nombre_tienda}" eliminado correctamente.`)
      } catch (err) {
        if (err?.code === CLIENT_ERROR_CODES.FK_VIOLATION) {
          errorToast(
            'No se puede eliminar: el cliente tiene ventas o cargas asociadas.',
          )
        } else {
          errorToast(err?.message ?? 'No se pudo eliminar el cliente.')
        }
      } finally {
        setConfirmOpen(false)
        setDeletingClient(null)
      }
      return
    }

    if (!pendingPayload) return

    try {
      if (confirmMode === 'edit' && editingClient) {
        await updateMutation.mutateAsync({
          id: editingClient.id,
          ...pendingPayload,
        })
        success(
          `Cliente "${pendingPayload.nombre_tienda}" actualizado correctamente.`,
        )
      } else {
        const registrante = currentUser?.email ?? null
        await createMutation.mutateAsync({ ...pendingPayload, registrante })
        success(
          `Cliente "${pendingPayload.nombre_tienda}" creado correctamente.`,
        )
      }
      setConfirmOpen(false)
      setPendingPayload(null)
      setFormOpen(false)
      setEditingClient(null)
    } catch (err) {
      setConfirmOpen(false)
      if (err?.code === CLIENT_ERROR_CODES.DUPLICATE) {
        setFormError(
          'El código ya existe. Regenera e intenta de nuevo.',
        )
      } else if (err?.code === CLIENT_ERROR_CODES.FK_VIOLATION) {
        setFormError('El vendedor seleccionado no existe.')
      } else {
        setFormError(err?.message ?? 'No se pudo guardar el cliente.')
      }
    }
  }

  const confirmTitle =
    confirmMode === 'delete'
      ? 'Eliminar cliente'
      : confirmMode === 'edit'
        ? 'Guardar cambios'
        : 'Crear cliente'

  const confirmContent =
    confirmMode === 'delete'
      ? `¿Eliminar el cliente "${deletingClient?.nombre_tienda ?? ''}"? Esta acción no se puede deshacer.`
      : confirmMode === 'edit'
        ? `¿Guardar los cambios del cliente "${editingClient?.nombre_tienda ?? pendingPayload?.nombre_tienda ?? ''}"?`
        : `¿Crear el cliente "${pendingPayload?.nombre_tienda ?? ''}" con código "${pendingPayload?.id ?? ''}"?`

  return (
    <section className='p-6 space-y-6 h-full flex flex-col overflow-hidden'>
      <header className='flex items-center gap-3'>
        <Store className='text-primary' size={28} />
        <h1 className='text-2xl font-bold text-on-background'>Clientes</h1>
      </header>

      <ClientsFilters
        vendors={users}
        searchDraft={searchDraft}
        vendorDraft={vendorDraft}
        onSearchDraftChange={setSearchDraft}
        onVendorDraftChange={setVendorDraft}
        onSearch={handleSearch}
        onNewClient={handleNew}
      />

      <ClientsTable
        clients={clients}
        total={total}
        page={page}
        pageSize={pageSize}
        isLoading={isLoading}
        isFetching={isFetching}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />

      <ClientFormModal
        key={editingClient?.id ?? `new-${formOpen}`}
        isOpen={formOpen}
        client={editingClient}
        vendors={users}
        isSubmitting={isSubmitting}
        errorMessage={formError}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title={confirmTitle}
        content={confirmContent}
        onClose={() => {
          setConfirmOpen(false)
          setPendingPayload(null)
          setDeletingClient(null)
        }}
        onConfirm={handleConfirm}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </section>
  )
}

export default ClientsPage
