import { useMutation, useQuery } from '@tanstack/react-query';
import { useSupabaseClient } from '../../../core/providers/hooks/useSupabase';

export function useLogQueries() {
  const client = useSupabaseClient();

  const createLog = async ({ idCarga, idUsuario, accion, motivo = null }) => {
    const { data, error } = await client
      .from('cargas_logs')
      .insert({
        id_carga: idCarga,
        id_usuario: idUsuario,
        accion,
        motivo,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const getLogsByCarga = async (cargaId) => {
    const { data, error } = await client
      .from('cargas_logs')
      .select('*, perfiles(*)')
      .eq('id_carga', cargaId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  };

  return {
    createLog,
    getLogsByCarga,
  };
}

export function useCreateLogMutation() {
  const { createLog } = useLogQueries();

  return useMutation({
    mutationFn: createLog,
    onError: (error) => {
      console.error('Error creating log:', error);
    },
  });
}

export function useLogsByCargaQuery(cargaId) {
  const { getLogsByCarga } = useLogQueries();

  return useQuery({
    queryKey: ['cargaLogs', cargaId],
    queryFn: () => getLogsByCarga(cargaId),
    enabled: !!cargaId,
  });
}