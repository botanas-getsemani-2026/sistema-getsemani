import { useSupabaseClient } from '../providers/hooks/useSupabase'

export function useSignIn() {
  const client = useSupabaseClient()

  const signIn = async (email, password) => {

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  return {
    signIn
  }
}

export function useSignOut() {
  const client = useSupabaseClient()

  const signOut = async () => {
    try {
      const { error } = await client.auth.signOut()
      return { error }
    } catch (error) {
      console.error('Error signing out:', error)
      return { error }
    }
  }

  return {
    signOut
  }
}