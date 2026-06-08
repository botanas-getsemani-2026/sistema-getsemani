import { useMutation, useQuery } from '@tanstack/react-query';
import { useSupabaseClient } from '../../../core/providers/hooks/useSupabase';

export function useNotificationQueries() {
  const client = useSupabaseClient();

  const createNotification = async ({ idUsuario, titulo, mensaje }) => {
    const { data, error } = await client
      .from('notificaciones')
      .insert({
        id_usuario: idUsuario,
        titulo,
        mensaje,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const getNotificationsByUser = async (userId) => {
    const { data, error } = await client
      .from('notificaciones')
      .select('*')
      .eq('id_usuario', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  };

  const markAsRead = async (notificationId) => {
    const { data, error } = await client
      .from('notificaciones')
      .update({ leido: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return {
    createNotification,
    getNotificationsByUser,
    markAsRead,
  };
}

export function useCreateNotificationMutation() {
  const { createNotification } = useNotificationQueries();

  return useMutation({
    mutationFn: createNotification,
    onError: (error) => {
      console.error('Error creating notification:', error);
    },
  });
}

export function useNotificationsByUserQuery(userId) {
  const { getNotificationsByUser } = useNotificationQueries();

  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => getNotificationsByUser(userId),
    enabled: !!userId,
  });
}