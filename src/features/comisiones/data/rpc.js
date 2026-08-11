import { useQuery } from '@tanstack/react-query'
import { useSupabaseClient } from '../../../core/providers/hooks/useSupabase'

const isRangeValid = (startDate, endDate) =>
  !!startDate && !!endDate && endDate >= startDate

export function useDailySales(startDate, endDate, vendorId = null) {
  const client = useSupabaseClient()
  const enabled = isRangeValid(startDate, endDate)

  return useQuery({
    queryKey: ['ventasDiarias', startDate, endDate, vendorId],
    queryFn: async () => {
      const { data, error } = await client.rpc('ventas_diarias', {
        fecha_inicio: startDate,
        fecha_fin: endDate,
        p_vendedor_id: vendorId,
      })
      if (error) throw error
      return data ?? []
    },
    enabled,
    // placeholderData: keepPreviousData,
  })
}

export function useVendorSales(startDate, endDate, vendorId = null) {
  const client = useSupabaseClient()
  const enabled = isRangeValid(startDate, endDate)

  return useQuery({
    queryKey: ['ventasVendedor', startDate, endDate, vendorId],
    queryFn: async () => {
      const { data, error } = await client.rpc('ventas_vendedor', {
        fecha_inicio: startDate,
        fecha_fin: endDate,
        p_vendedor_id: vendorId,
      })
      if (error) throw error
      return data ?? []
    },
    enabled,
    // placeholderData: keepPreviousData,
  })
}

export function useDailyVendorSales(startDate, endDate, vendorId = null) {
  const client = useSupabaseClient()
  const enabled = isRangeValid(startDate, endDate)

  return useQuery({
    queryKey: ['ventasDiariasVendedor', startDate, endDate, vendorId],
    queryFn: async () => {
      const { data, error } = await client.rpc('ventas_diarias_vendedor', {
        fecha_inicio: startDate,
        fecha_fin: endDate,
        p_vendedor_id: vendorId,
      })
      if (error) throw error
      return data ?? []
    },
    enabled,
    // placeholderData: keepPreviousData,
  })
}

export function useCommissionPreview(startDate, endDate, vendorId = null) {
  const client = useSupabaseClient()
  const enabled = isRangeValid(startDate, endDate)

  return useQuery({
    queryKey: ['commissionPreview', startDate, endDate, vendorId],
    queryFn: async () => {
      const { data, error } = await client.rpc('calcular_comision_vendedor', {
        fecha_inicio: startDate,
        fecha_fin: endDate,
        p_vendedor_id: vendorId,
      })
      if (error) throw error
      return data ?? []
    },
    enabled,
    // placeholderData: keepPreviousData,
  })
}
