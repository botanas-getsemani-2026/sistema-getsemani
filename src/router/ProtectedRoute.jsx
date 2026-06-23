import { Outlet } from 'react-router'
import { useCurrentUser } from '../core/services/users'
import { Loader } from 'lucide-react'
import { Navigate } from 'react-router'

export function ProtectedRoute() {
  const {data: user, isLoading} = useCurrentUser()

  if (isLoading) return <Loader/>
  if (!user) return <Navigate to='/login' replace/> 
  
  return <Outlet/>
}

