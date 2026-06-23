import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSupabaseClient } from '../../../core/providers/hooks/useSupabase'

export function useCreateProductMutation() {
  const client = useSupabaseClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await client
        .from('productos')
        .insert({
          codigo: payload.codigo,
          nombre: payload.nombre,
          precio: payload.precio,
          es_a_granel: payload.es_a_granel,
          logo_res: '',
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUpdateProductMutation() {
  const client = useSupabaseClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...patch }) => {
      const { data, error } = await client
        .from('productos')
        .update(patch)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useDeleteProductMutation() {
  const client = useSupabaseClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId) => {
      const { error } = await client
        .from('productos')
        .delete()
        .eq('id', productId)

      if (error) throw error
      return productId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useProductUsageCount(productId, options = {}) {
  const client = useSupabaseClient()

  return useQuery({
    queryKey: ['productUsageCount', productId],
    queryFn: async () => {
      const { count, error } = await client
        .from('cargas_detalles')
        .select('*', { count: 'exact', head: true })
        .eq('id_producto', productId)

      if (error) throw error
      return count ?? 0
    },
    enabled: !!productId,
    staleTime: 30_000,
    ...options,
  })
}
