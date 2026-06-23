import { useQuery } from '@tanstack/react-query'
import { useSupabaseClient } from '../providers/hooks/useSupabase'

export function useAllProducts() {
  const client = useSupabaseClient()

  return useQuery({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      const { data, error } = await client
        .from('productos')
        .select('*')
        .order('nombre')

      if (error) throw error
      return data ?? []
    },
    staleTime: 5 * 60 * 1000,
  })
}
