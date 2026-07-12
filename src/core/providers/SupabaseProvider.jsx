import { createClient } from '@supabase/supabase-js/dist/index.cjs'
import { useState, useEffect } from 'react'
import { SupabaseContext } from './SupabaseContext'
import { useQueryClient } from '@tanstack/react-query'

const client = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
)

export function SupabaseProvider({ children }) {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const queryClient = useQueryClient()

	useEffect(() => {
		client.auth
			.getSession()
			.then(({ data: { session } }) => {
				setUser(session?.user ?? null)
			})
			.catch(error => {
				console.error('Error getting session:', error)
			})
			.finally(() => {
				setLoading(false)
			})

		const {
			data: { subscription },
		} = client.auth.onAuthStateChange((event, session) => {
			setUser(session?.user ?? null)

			if (event === 'SIGNED_OUT') {
				queryClient.clear()
			}
		})

		return () => subscription.unsubscribe()
	}, [queryClient])

	return (
		<SupabaseContext.Provider value={{ client, user, loading }}>
			{children}
		</SupabaseContext.Provider>
	)
}
