import { Loader } from '../components/ui/Loader'
import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router'
import { SupabaseContext } from '../core/providers/SupabaseContext'

export function PublicOnlyRoute() {
  const { user, loading } = useContext(SupabaseContext)

  console.log('PublicOnlyRoute user:', user, 'isLoading:', loading)

  if (loading) return <Loader/>
  if (user) return <Navigate to='/ventas' replace/> 
  
  return <Outlet/>
}

