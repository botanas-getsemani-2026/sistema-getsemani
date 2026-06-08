import { useQuery } from '@tanstack/react-query'
import { useSupabaseClient } from '../../../core/providers/hooks/useSupabase'

export function useProductsQueries() {
  const client = useSupabaseClient()

  const fetchAllProducts = async () => {
    const { data, error } = await client
      .from('productos')
      .select('*')
      .order('nombre')
    if (error) throw error
    return data
  }

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
    staleTime: Infinity,
  })

  return { products, isLoading, error }
}