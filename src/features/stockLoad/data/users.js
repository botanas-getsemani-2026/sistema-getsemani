import { useState, useEffect } from "react";
import { useSupabaseClient } from "../../../core/providers/hooks/useSupabase";
import { useCallback } from "react";

export const useUsersQueries = () => {
  const client = useSupabaseClient();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  const getUsers = useCallback(async () => {
    const { data, error } = await client.from('perfiles').select();
    if (error) throw error;
    setUsers(data ?? []);
    console.log(data);
  }, [client]);

  const getCurrentUser = useCallback(async () => {
    const { data: { user } } = await client.auth.getUser();
    setUser(user);
  }, [client])

  return {
    users,
    user,
    getUsers,
    getCurrentUser,
  };
};

export const useCurrentUser = () => {
  const client = useSupabaseClient();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await client.auth.getUser();
      if (user) {
        const { data: profile } = await client
          .from('perfiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setCurrentUser(profile || user);
      }
      setLoading(false);
    };
    getUser();
  }, [client]);

  return { currentUser, loading };
};
