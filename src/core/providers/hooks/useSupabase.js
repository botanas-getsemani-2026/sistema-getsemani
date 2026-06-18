import { useContext } from "react";
import { SupabaseContext } from "../SupabaseContext";

export function useSupabaseContext() {
  const context = useContext(SupabaseContext);
  if (!context) throw new Error("useSupabase must be used within a SupabaseProvider");
  return context;
}

export const useSupabaseClient = () => {
  const { client } = useSupabaseContext();
  return client;
};