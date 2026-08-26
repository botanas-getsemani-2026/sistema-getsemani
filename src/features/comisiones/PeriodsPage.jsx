import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Wallet, ArrowLeft } from 'lucide-react'
import { ToastContainer } from '../../components/ui/Toast'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { useToast } from '../../core/hooks/useToast'
import { PeriodsHistoryList } from './components/PeriodsHistoryList'
import { usePeriods } from './data/periods'
import {
	useMarkPeriodPaidMutation,
	useDeletePeriodMutation,
} from './data/commissions'

export function PeriodsPage() {
	const navigate = useNavigate()
	const { toasts, removeToast, success, error: errorToast } = useToast()

	const [confirmPaid, setConfirmPaid] = useState(null)
	const [confirmDelete, setConfirmDelete] = useState(null)

	const { data: periods, isLoading } = usePeriods()
	const markPaidMutation = useMarkPeriodPaidMutation()
	const deleteMutation = useDeletePeriodMutation()

	const handleConfirmMarkPaid = async () => {
		if (!confirmPaid) return
		try {
			await markPaidMutation.mutateAsync(confirmPaid.id)
			success(`Periodo del ${confirmPaid.fecha_inicio} marcado como pagado.`)
		} catch (err) {
			errorToast(err?.message ?? 'No se pudo marcar el periodo como pagado.')
		} finally {
			setConfirmPaid(null)
		}
	}

	const handleConfirmDelete = async () => {
		if (!confirmDelete) return
		try {
			await deleteMutation.mutateAsync(confirmDelete.id)
			success(`Periodo del ${confirmDelete.fecha_inicio} eliminado.`)
		} catch (err) {
			errorToast(err?.message ?? 'No se pudo eliminar el periodo.')
		} finally {
			setConfirmDelete(null)
		}
	}

	const busyId = markPaidMutation.isPending
		? markPaidMutation.variables
		: deleteMutation.isPending
			? deleteMutation.variables
			: null

	return (
		<section className='p-6 space-y-6 h-full flex flex-col overflow-auto'>
			<header className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<Wallet className='text-primary' size={28} />
					<h1 className='text-2xl font-bold text-on-background'>
						Historial de periodos
					</h1>
				</div>
				<button
					type='button'
					onClick={() => navigate('/comisiones')}
					className='px-3 py-1.5 rounded-md text-sm bg-surface-variant text-on-background hover:bg-surface-variant/70 transition-colors flex items-center gap-2'
				>
					<ArrowLeft size={16} />
					Volver al reporte
				</button>
			</header>

			<PeriodsHistoryList
				periods={periods}
				isLoading={isLoading}
				onMarkPaid={setConfirmPaid}
				onDelete={setConfirmDelete}
				busyId={busyId}
			/>

<ConfirmModal
        isOpen={!!confirmPaid}
        title='Marcar como pagado'
        content={`¿Marcar el periodo ${confirmPaid?.fecha_inicio ?? ''} como pagado? Esta acción no se puede deshacer.`}
        isPending={markPaidMutation.isPending}
        onClose={() => setConfirmPaid(null)}
        onConfirm={handleConfirmMarkPaid}
      />

      <ConfirmModal
        isOpen={!!confirmDelete}
        title='Eliminar periodo'
        content={`¿Eliminar el periodo ${confirmDelete?.fecha_inicio ?? ''}? Esta acción no se puede deshacer.`}
        isPending={deleteMutation.isPending}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleConfirmDelete}
      />

			<ToastContainer toasts={toasts} onClose={removeToast} />
		</section>
	)
}
