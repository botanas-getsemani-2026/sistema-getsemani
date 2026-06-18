import { createBrowserRouter, Navigate } from 'react-router'
import { ProtectedRoute } from './ProtectedRoute'
import { SalesPage } from '../features/sales/SalesPage'
import { StockLoadPage } from '../features/stockLoad/StockLoadPage'
import App from '../App'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <ProtectedRoute />,
		children: [
			{
				element: <App />,
				children: [
					{ index: true, element: <Navigate to='/ventas' replace /> },
					{ path: 'ventas', element: <SalesPage /> },
					{ path: 'cargas', element: <StockLoadPage /> },
				],
			},
		],
	},
])
