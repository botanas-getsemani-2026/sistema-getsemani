import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSupabaseClient } from '../../../core/providers/hooks/useSupabase'
import {
  CLIENT_CODE_GENERATION_MAX_ATTEMPTS,
  CLIENT_CODE_PREFIX,
  generateClientCode as buildCode,
} from '../../../constants/clients'

export const CLIENTS_QUERY_KEY = ['clients', 'paginated']

async function fetchClients(client, { search, id_usuario }, page, pageSize) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = client
    .from('tiendas')
    .select(
      `
        id,
        id_usuario,
        nombre_tienda,
        dueno,
        telefono,
        direccion,
        longitud,
        latitud,
        detalles,
        registrante,
        tiene_credito,
        created_at,
        updated_at,
        perfiles:id_usuario ( id, nombre, papellido, email )
      `,
      { count: 'exact' },
    )
    .order('nombre_tienda', { ascending: true })
    .range(from, to)

  const term = search?.trim()
  if (term) {
    query = query.or(`id.ilike.%${term}%,nombre_tienda.ilike.%${term}%`)
  }

  if (id_usuario) {
    query = query.eq('id_usuario', id_usuario)
  }

  const { data, error, count } = await query
  if (error) throw error

  return { clients: data ?? [], total: count ?? 0 }
}

export function useClientsPaginated(filters = {}, page = 1, pageSize = 50) {
  const client = useSupabaseClient()

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [...CLIENTS_QUERY_KEY, filters, page, pageSize],
    queryFn: () => fetchClients(client, filters, page, pageSize),
    placeholderData: keepPreviousData,
  })

  return {
    clients: data?.clients ?? [],
    total: data?.total ?? 0,
    isLoading,
    isFetching,
    isError,
  }
}

export async function checkClientCodeExists(client, code) {
  if (!code) return false
  const { data, error } = await client
    .from('tiendas')
    .select('id')
    .eq('id', code)
    .maybeSingle()

  if (error) throw error
  return !!data
}

export async function generateUniqueClientCode(client) {
  for (let attempt = 0; attempt < CLIENT_CODE_GENERATION_MAX_ATTEMPTS; attempt++) {
    const candidate = buildCode()
    if (!candidate.startsWith(`${CLIENT_CODE_PREFIX}-`)) continue
    const exists = await checkClientCodeExists(client, candidate)
    if (!exists) return candidate
  }
  throw new Error(
    'No se pudo generar un código único tras varios intentos. Intenta regenerarlo manualmente.',
  )
}
