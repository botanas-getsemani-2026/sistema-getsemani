import { useQuery } from "@tanstack/react-query";
import { useSupabaseClient } from "../providers/hooks/useSupabase";

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
