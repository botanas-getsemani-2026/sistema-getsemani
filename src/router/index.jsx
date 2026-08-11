import { createBrowserRouter, Navigate } from 'react-router'
import { ProtectedRoute } from './ProtectedRoute'
import { ProductsPage } from '../features/products/ProductsPage'
import { SalesPage } from '../features/sales/SalesPage'
import { StockLoadPage } from '../features/stockLoad/StockLoadPage'
import { VendorsPage } from '../features/vendors/VendorsPage'
import { CommissionsPage } from '../features/comisiones/CommissionsPage'
import { PeriodsPage } from '../features/comisiones/PeriodsPage'
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
					{ path: 'productos', element: <ProductsPage /> },
					{ path: 'vendedores', element: <VendorsPage /> },
					{ path: 'comisiones', element: <CommissionsPage /> },
					{ path: 'comisiones/periodos', element: <PeriodsPage /> },
				],
			},
		],
	},
])
