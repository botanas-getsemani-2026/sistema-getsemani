import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSupabaseClient } from '../../../core/providers/hooks/useSupabase'
import { PRODUCT_TYPE_FILTER } from '../../../constants/products'

export function useProducts(filters = {}, page = 1, pageSize = 50) {
  const client = useSupabaseClient()

  const fetchProducts = async ({ filters, page, pageSize }) => {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = client
      .from('productos')
      .select('*', { count: 'exact' })
      .order('orden')
      .range(from, to)

    const term = filters.searchTerm?.trim()
    if (term) {
      query = query.or(`nombre.ilike.%${term}%,codigo.ilike.%${term}%`)
    }

    if (filters.typeFilter === PRODUCT_TYPE_FILTER.BULK) {
      query = query.eq('es_a_granel', true)
    } else if (filters.typeFilter === PRODUCT_TYPE_FILTER.UNIT) {
      query = query.eq('es_a_granel', false)
    }

    if (filters.statusFilter && filters.statusFilter !== 'todos') {
      query = query.eq('estado', filters.statusFilter)
    }

    const { data, error, count } = await query
    if (error) throw error

    return { products: data ?? [], total: count ?? 0 }
  }

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['products', 'paginated', filters, page, pageSize],
    queryFn: () => fetchProducts({ filters, page, pageSize }),
    placeholderData: keepPreviousData,
  })

  return {
    products: data?.products ?? [],
    total: data?.total ?? 0,
    isLoading,
    isFetching,
    isError,
  }
}
