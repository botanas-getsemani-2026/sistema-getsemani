import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSupabaseClient } from '../../../core/providers/hooks/useSupabase'
import { PERIODS_QUERY_KEY } from '../../../constants/comisiones'

const invalidatePeriods = (qc) => {
  qc.invalidateQueries({ queryKey: [PERIODS_QUERY_KEY] })
  qc.invalidateQueries({ queryKey: ['commissionPreview'] })
}

export function useGeneratePeriodMutation() {
  const client = useSupabaseClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ startDate, endDate }) => {
      const { data, error } = await client.rpc('generar_comisiones_periodo', {
        fecha_inicio: startDate,
        fecha_fin: endDate,
      })
      if (error) throw error
      return data
    },
    onSuccess: () => invalidatePeriods(qc),
  })
}

export function useMarkPeriodPaidMutation() {
  const client = useSupabaseClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (periodId) => {
      const { error } = await client.rpc('cambiar_estado_periodo', {
        periodo_id: periodId,
      })
      if (error) throw error
      return periodId
    },
    onSuccess: () => invalidatePeriods(qc),
  })
}

export function useDeletePeriodMutation() {
  const client = useSupabaseClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (periodId) => {
      const { error } = await client.rpc('eliminar_periodo_comision', {
        periodo_id: periodId,
      })
      if (error) throw error
      return periodId
    },
    onSuccess: () => invalidatePeriods(qc),
  })
}
