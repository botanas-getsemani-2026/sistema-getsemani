import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSupabaseClient } from '../../../core/providers/hooks/useSupabase'

const invalidateVendors = (qc) => {
  qc.invalidateQueries({ queryKey: ['vendors'] })
  qc.invalidateQueries({ queryKey: ['users'] })
}

export function useCreateVendorMutation() {
  const client = useSupabaseClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await client.functions.invoke('create-vendor', {
        body: payload,
      })
      console.log('error',error)
      console.log('data', data)
      if (error) {
        const body = await error.context.json()
        const message = body?.error ?? error.message
        const code = body?.code ?? null
        const err = new Error(message)
        err.code = code
        throw err
      }
      if (data?.error) {
        const err = new Error(data.error)
        err.code = data.code
        throw err
      }
      return data?.profile ?? data
    },
    onSuccess: () => invalidateVendors(qc),
  })
}

export function useUpdateVendorMutation() {
  const client = useSupabaseClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...patch }) => {
      const { data, error } = await client
        .from('perfiles')
        .update(patch)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      invalidateVendors(qc)
      qc.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}