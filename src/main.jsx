import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { SupabaseProvider } from './core/providers/SupabaseProvider.jsx'
import './index.css'
import { router } from './router/index.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <RouterProvider router={router} />
      </SupabaseProvider>
    </QueryClientProvider>
  </StrictMode>,
)