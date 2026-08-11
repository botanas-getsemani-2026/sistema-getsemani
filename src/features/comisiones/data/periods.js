import { useQuery } from '@tanstack/react-query'
import { useSupabaseClient } from '../../../core/providers/hooks/useSupabase'
import { PERIODS_QUERY_KEY } from '../../../constants/comisiones'

export function usePeriods() {
  const client = useSupabaseClient()

  return useQuery({
    queryKey: [PERIODS_QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await client
        .from('periodos_comision')
        .select('*')
        .order('fecha_inicio', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function usePeriodById(periodId) {
  const client = useSupabaseClient()

  return useQuery({
    queryKey: [PERIODS_QUERY_KEY, periodId],
    queryFn: async () => {
      const { data, error } = await client
        .from('periodos_comision')
        .select('*')
        .eq('id', periodId)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!periodId,
  })
}
