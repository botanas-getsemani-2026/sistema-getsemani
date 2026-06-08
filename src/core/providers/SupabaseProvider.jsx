import { createClient } from "@supabase/supabase-js/dist/index.cjs";
import { useState, useEffect } from "react";
import { SupabaseContext } from "./SupabaseContext";

const client = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

const signIn = async () => {
  const { data, error } = await client.auth.signInWithPassword({
    email: 'get1234@getsemani.com',
    password: 'Get2026',
  });

  if (error) throw new Error(error.message);

  const { data: profileData, error: profileDataError } = await client
    .from("perfiles")
    .select()
    .eq("id", data.user.id)
    .single();

  if (profileDataError) throw new Error(profileDataError.message);

  return { user: data.user, profile: profileData };
};

export function SupabaseProvider({ children }) {
  // const [client] = useState(() =>
  //   createClient(
  //     import.meta.env.VITE_SUPABASE_URL,
  //     import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  //   ),
  // );

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    signIn()
      .then(({ user, profile }) => {
        setUser(user);
        setProfile(profile);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <SupabaseContext.Provider value={{ client, user, profile, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
}
