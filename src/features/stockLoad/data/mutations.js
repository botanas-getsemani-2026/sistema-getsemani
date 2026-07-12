import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from '../../../core/providers/hooks/useSupabase';

export function useLoadMutations() {
  const client = useSupabaseClient();
  // const createLogMutation = useCreateLogMutation();
  // const createNotificationMutation = useCreateNotificationMutation();

  const authorizeLoad = async ({ loadId }) => {
    const { data: loadData, error: loadError } = await client
      .from('cargas')
      .update({ status: 'autorizada' })
      .eq('id', loadId)
      .select('id_usuario')
      .single();

      console.log('Authorize load result:', loadData, loadError);

    if (loadError) throw loadError;

    // await createLogMutation.mutateAsync({
    //   idCarga: loadId,
    //   idUsuario: userId,
    //   accion: 'autorizada',
    //   motivo: null,
    // });

    // await createNotificationMutation.mutateAsync({
    //   idUsuario: loadData.id_usuario,
    //   titulo: 'Carga Autorizada',
    //   mensaje: 'Tu carga ha sido autorizada.',
    // });

    return loadData;
  };

  const rejectLoad = async ({ loadId, motivo }) => {
    const { data: loadData, error: loadError } = await client
      .from('cargas')
      .update({ status: 'rechazada', motivo_rechazo: motivo })
      .eq('id', loadId)
      .select('id_usuario')
      .single();

    if (loadError) throw loadError;

    // await createLogMutation.mutateAsync({
    //   idCarga: loadId,
    //   idUsuario: userId,
    //   accion: 'rechazada',
    //   motivo,
    // });

    // await createNotificationMutation.mutateAsync({
    //   idUsuario: loadData.id_usuario,
    //   titulo: 'Carga Rechazada',
    //   mensaje: `Tu carga ha sido rechazada. Motivo: ${motivo}`,
    // });

    return loadData;
  };

  const saveLoadDetails = async ({ loadId, details }) => {
    for (const detail of details) {
      if (detail._deleted) {
        const result = await client
          .from('cargas_detalles')
          .delete()
          .eq('id', detail.id);
          console.log('Delete result:', result);
      } else if (detail._isNew) {
        await client.from('cargas_detalles').insert({
          id_carga: loadId,
          id_producto: detail.productId,
          codigo_producto: detail.product.codigo,
          nombre_producto: detail.product.nombre,
          precio_producto: detail.product.precio,
          cantidad: detail.quantity,
        });
      } else {
        await client
          .from('cargas_detalles')
          .update({
            cantidad: detail.quantity,
          })
          .eq('id', detail.id);
      }
    }

    return true;
  };

  return {
    authorizeLoad,
    rejectLoad,
    saveLoadDetails,
  };
}

export function useAuthorizeLoadMutation() {
  const { authorizeLoad } = useLoadMutations();
  const queryClient = useQueryClient();


  return useMutation({
    mutationFn: authorizeLoad,
    onSuccess: () => {
      console.log('Load authorized successfully, invalidating queries...');
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({
        queryKey: ['vendorLoads'],
        // refetchType: 'all'
      });
    },
    onError: (error) => {
      console.error('Error authorizing load:', error);
    },
  });
}

export function useRejectLoadMutation() {
  const { rejectLoad } = useLoadMutations();
  const queryClient = useQueryClient();


  return useMutation({
    mutationFn: rejectLoad,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vendorLoads']
      })
    },
    onError: (error) => {
      console.error('Error rejecting load:', error);
    },
  });
}

export function useSaveLoadDetailsMutation() {
  const { saveLoadDetails } = useLoadMutations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveLoadDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vendorLoads']
      })
    },
    onError: (error) => {
      console.error('Error saving load details:', error);
    },
  });
}