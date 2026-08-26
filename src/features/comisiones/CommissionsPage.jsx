import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Wallet, Loader2 } from 'lucide-react'
import { ToastContainer } from '../../components/ui/Toast'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { Tabs } from '../../components/ui/Tabs'
import { formatCurrency } from '../../utils/currencyUtils'
import { useToast } from '../../core/hooks/useToast'
import {
	ERROR_CODES,
	OVERLAP_MESSAGE,
	EMPTY_RANGE_MESSAGE,
} from '../../constants/comisiones'
import { DateRangeForm } from './components/DateRangeForm'
import { KpiCards } from './components/KpiCards'
import { DailySalesTable } from './components/DailySalesTable'
import { VendorSummaryTable } from './components/VendorSummaryTable'
import { DailySalesChart } from './components/DailySalesChart'
import { VendorDailyPivotTable } from './components/VendorDailyPivotTable'
import { PeriodsHistoryList } from './components/PeriodsHistoryList'
import { EmptyState } from './components/EmptyState'
import {
	useDailySales,
	useVendorSales,
	useDailyVendorSales,
	useCommissionPreview,
} from './data/rpc'
import { usePeriods } from './data/periods'
import {
	useGeneratePeriodMutation,
	useMarkPeriodPaidMutation,
	useDeletePeriodMutation,
} from './data/commissions'
import { useUsers } from '../../core/services/users'

function extractErrorCode(error) {
	if (!error) return null
	return error.code ?? error?.details ?? null
}

export function CommissionsPage() {
	const navigate = useNavigate()
	const { toasts, removeToast, success, error: errorToast } = useToast()

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [submittedRange, setSubmittedRange] = useState(null)
  const [activeTab, setActiveTab] = useState('report')
  const [vendorSelected, setVendorSelected] = useState(null)

	const [confirmPaid, setConfirmPaid] = useState(null)
	const [confirmDelete, setConfirmDelete] = useState(null)

  const vendors = useUsers()

	const dailyQuery = useDailySales(
		submittedRange?.startDate,
		submittedRange?.endDate,
    submittedRange?.vendorSelected ?? null
	)
	const vendorQuery = useVendorSales(
		submittedRange?.startDate,
		submittedRange?.endDate,
    submittedRange?.vendorSelected ?? null
	)
	const dailyVendorQuery = useDailyVendorSales(
		submittedRange?.startDate,
		submittedRange?.endDate,
    submittedRange?.vendorSelected ?? null
	)
	const commissionQuery = useCommissionPreview(
		submittedRange?.startDate,
		submittedRange?.endDate,
    submittedRange?.vendorSelected ?? null
	)

	const { data: periods, isLoading: periodsLoading } = usePeriods()

	const generateMutation = useGeneratePeriodMutation()
	const markPaidMutation = useMarkPeriodPaidMutation()
	const deleteMutation = useDeletePeriodMutation()

	const handleSearch = () => {
		if (!startDate || !endDate || endDate < startDate) return
    setSubmittedRange({ startDate, endDate, vendorSelected })
	}

	const handleGenerate = async () => {
		if (!startDate || !endDate || endDate < startDate) return
		try {
			const periodId = await generateMutation.mutateAsync({
				startDate,
				endDate,
			})
			success('Reporte de comisiones generado correctamente.')
			navigate(`/comisiones/periodos`)
			if (periodId) {
				console.debug('Generated period id:', periodId)
			}
		} catch (err) {
			const code = extractErrorCode(err)
			if (code === ERROR_CODES.PERIOD_OVERLAP) {
				errorToast(OVERLAP_MESSAGE)
			} else {
				errorToast(err?.message ?? 'No se pudo generar el reporte.')
			}
		}
	}

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

	const vendorRows = useMemo(() => vendorQuery.data ?? [], [vendorQuery.data])
	const dailyRows = useMemo(() => dailyQuery.data ?? [], [dailyQuery.data])
	const dailyVendorRows = useMemo(
		() => dailyVendorQuery.data ?? [],
		[dailyVendorQuery.data],
	)
	const commissionRows = useMemo(
		() => commissionQuery.data ?? [],
		[commissionQuery.data],
	)

	const allQueriesSettled =
		!dailyQuery.isPending &&
		!vendorQuery.isPending &&
		!dailyVendorQuery.isPending &&
		!commissionQuery.isPending

	const anyQueryFetching =
		dailyQuery.isFetching ||
		vendorQuery.isFetching ||
		dailyVendorQuery.isFetching ||
		commissionQuery.isFetching

	const hasAnyData =
		vendorRows.length > 0 || dailyRows.length > 0 || dailyVendorRows.length > 0

	const showEmpty =
		!!submittedRange && allQueriesSettled && !anyQueryFetching && !hasAnyData

	const totalCents = useMemo(
		() => vendorRows.reduce((acc, r) => acc + Number(r.total ?? 0), 0),
		[vendorRows],
	)

  const totalExcludedProductsCents = useMemo(
    () => dailyRows.reduce((acc, row) => acc + Number(row.total_productos_excluidos ?? 0), 0),
    [dailyRows],
  )

	const dailyAverageCents = useMemo(() => {
		if (dailyRows.length === 0) return 0
		return Math.round(totalCents / dailyRows.length)
	}, [totalCents, dailyRows.length])

	const showReport = !!submittedRange

	const busyId = markPaidMutation.isPending
		? markPaidMutation.variables
		: deleteMutation.isPending
			? deleteMutation.variables
			: null

  return (
    <section className='p-6 space-y-4 h-full flex flex-col overflow-hidden'>
      <header className='flex items-center gap-3'>
        <Wallet className='text-primary' size={28} />
        <h1 className='text-2xl font-bold text-on-background'>Comisiones</h1>
      </header>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        tabs={[
          { value: 'report', label: 'Reporte' },
          { value: 'history', label: 'Historial', badge: periods?.length ?? 0 },
        ]}
      />

      <div className='flex-1 overflow-auto'>
        {activeTab === 'report' && (
          <div className='space-y-4 pt-1'>
            <DateRangeForm
              startDate={startDate}
              endDate={endDate}
              vendors={vendors?.data ?? []}
              vendorSelected={vendorSelected}
              onVendorSelectedChange={setVendorSelected}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onSearch={handleSearch}
              isConsulting={
                dailyQuery.isFetching ||
                vendorQuery.isFetching ||
                dailyVendorQuery.isFetching
              }
              onGenerate={handleGenerate}
              isGenerating={generateMutation.isPending}
            />

            {showReport && (
              <div className='relative space-y-4'>
                {showEmpty ? (
                  <EmptyState message={EMPTY_RANGE_MESSAGE} />
                ) : (
                  <>
                    <KpiCards
                      totalCents={totalCents}
                      vendorCount={vendorRows.length}
                      dailyAverageCents={dailyAverageCents}
                      excludedProductsTotal={totalExcludedProductsCents}
                    />

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                      <DailySalesTable
                        rows={dailyRows}
                        isLoading={dailyQuery.isPending}
                      />
                      <VendorSummaryTable
                        rows={vendorRows}
                        isLoading={vendorQuery.isPending}
                      />
                    </div>

                    <DailySalesChart
                      rows={dailyRows}
                      isLoading={dailyQuery.isPending}
                    />

                    <VendorDailyPivotTable
                      rows={dailyVendorRows}
                      isLoading={dailyVendorQuery.isPending}
                    />

                    {commissionRows.length > 0 && (
                      <CommissionPreviewTable
                        rows={commissionRows}
                        isLoading={commissionQuery.isPending}
                      />
                    )}
                  </>
                )}

                {anyQueryFetching && !hasAnyData && (
                  <div className='absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg'>
                    <div className='flex flex-col items-center gap-3'>
                      <Loader2 className='animate-spin text-primary' size={40} />
                      <p className='text-on-surface-variant text-sm'>
                        Cargando reporte…
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className='pt-1'>
            <PeriodsHistoryList
              periods={periods}
              isLoading={periodsLoading}
              onMarkPaid={setConfirmPaid}
              onDelete={setConfirmDelete}
              busyId={busyId}
            />
          </div>
        )}
      </div>

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

function CommissionPreviewTable({ rows, isLoading }) {
	return (
		<div className='bg-surface rounded-lg border border-on-surface-variant/10 overflow-auto'>
			<div className='px-4 py-3 border-b border-on-surface-variant/10'>
				<h3 className='text-base font-semibold text-on-background'>
					Preview de comisiones
				</h3>
				<p className='text-xs text-on-surface-variant mt-0.5'>
					Estimación por vendedor. Este cálculo no se persiste hasta generar el
					reporte oficial.
				</p>
			</div>
			<div className='overflow-x-auto'>
				<table className='w-full text-left text-on-background'>
					<thead className='bg-surface-variant text-on-surface-variant text-xs uppercase tracking-wide'>
						<tr>
							<th className='px-4 py-3 font-medium'>Vendedor</th>
							<th className='px-4 py-3 font-medium text-right'>
								Total vendido
							</th>
							<th className='px-4 py-3 font-medium text-right'>Comisión</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-on-surface-variant/10'>
						{isLoading && (
							<tr>
								<td
									colSpan={3}
									className='px-4 py-6 text-center text-on-surface-variant'
								>
									Cargando…
								</td>
							</tr>
						)}
						{rows.map(row => (
							<tr
								key={row.vendedor}
								className='hover:bg-surface-variant/40 transition-colors'
							>
								<td className='px-4 py-3'>{row.vendedor}</td>
								<td className='px-4 py-3 text-right tabular-nums'>
									{formatCurrency(row.total ?? 0)}
								</td>
								<td className='px-4 py-3 text-right tabular-nums text-primary font-semibold'>
									{formatCurrency(row.comision ?? 0)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
