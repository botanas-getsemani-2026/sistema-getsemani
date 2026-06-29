import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSupabaseClient } from '../providers/hooks/useSupabase'
import { VENDOR_STATUS_FILTER } from '../../constants/vendors'

export const useCurrentUser = (options = {}) => {
  const client = useSupabaseClient()

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user }, error } = await client.auth.getUser();

      if (error) throw error;
      if (!user) return null;

      const { data: profile } = await client
        .from('perfiles')
        .select()
        .eq('id', user.id)
        .single();

      return profile ?? user
    },
    staleTime: 5 * 60 * 1000,
    ...options
  })
};

export const useUsers = (options = {}) => {
  const client = useSupabaseClient()

  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await client.from('perfiles').select()
      if (error) throw error
      return data ?? []
    },
    staleTime: 5 * 60 * 1000,
    ...options
  })
};

export function useUsersPaginated(filters = {}, page = 1, pageSize = 50) {
  const client = useSupabaseClient()

  const fetchUsers = async ({ filters, page, pageSize }) => {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = client
      .from('perfiles')
      .select(
        'id, email, nombre, papellido, sapellido, rol, estado',
        { count: 'exact' },
      )
      .order('nombre', { ascending: true })
      .order('papellido', { ascending: true })
      .range(from, to)

    const nameTerm = filters.searchName?.trim()
    if (nameTerm) {
      query = query.or(
        `nombre.ilike.%${nameTerm}%,papellido.ilike.%${nameTerm}%,sapellido.ilike.%${nameTerm}%`,
      )
    }

    const emailTerm = filters.searchEmail?.trim()
    if (emailTerm) {
      query = query.ilike('email', `%${emailTerm}%`)
    }

    if (
      filters.statusFilter &&
      filters.statusFilter !== VENDOR_STATUS_FILTER.ALL
    ) {
      query = query.eq('estado', filters.statusFilter)
    }

    const { data, error, count } = await query
    if (error) throw error

    return { users: data ?? [], total: count ?? 0 }
  }

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['vendors', 'paginated', filters, page, pageSize],
    queryFn: () => fetchUsers({ filters, page, pageSize }),
    placeholderData: keepPreviousData,
  })

  return {
    users: data?.users ?? [],
    total: data?.total ?? 0,
    isLoading,
    isFetching,
    isError,
  }
}