import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSupabaseClient } from '../../../core/providers/hooks/useSupabase'
import { CLIENTS_QUERY_KEY } from './queries'

export const CLIENT_ERROR_CODES = {
  DUPLICATE: '23505',
  FK_VIOLATION: '23503',
}

function buildError(err, fallback) {
  const code = err?.code ?? null
  const message = err?.message ?? fallback
  const wrapped = new Error(message)
  wrapped.code = code
  return wrapped
}

const invalidateClients = (qc) => {
  qc.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY })
}

export function useCreateClientMutation() {
  const client = useSupabaseClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await client
        .from('tiendas')
        .insert(payload)
        .select()
        .single()
      if (error) throw buildError(error, 'No se pudo crear el cliente.')
      return data
    },
    onSuccess: () => invalidateClients(qc),
  })
}

export function useUpdateClientMutation() {
  const client = useSupabaseClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...patch }) => {
      const { data, error } = await client
        .from('tiendas')
        .update(patch)
        .eq('id', id)
        .select()
        .single()
      if (error) throw buildError(error, 'No se pudo actualizar el cliente.')
      return data
    },
    onSuccess: () => invalidateClients(qc),
  })
}

export function useDeleteClientMutation() {
  const client = useSupabaseClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await client.from('tiendas').delete().eq('id', id)
      if (error) throw buildError(error, 'No se pudo eliminar el cliente.')
      return id
    },
    onSuccess: () => invalidateClients(qc),
  })
}
