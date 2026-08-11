import { createBrowserRouter, Navigate } from 'react-router'
import App from '../App'
import LoginPage from '../features/login/LoginPage'
import { ProductsPage } from '../features/products/ProductsPage'
import { SalesPage } from '../features/sales/SalesPage'
import { StockLoadPage } from '../features/stockLoad/StockLoadPage'
import { VendorsPage } from '../features/vendors/VendorsPage'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'
import { ComisionesPage } from '../features/comisiones/ComisionesPage'
import { PeriodosPage } from '../features/comisiones/PeriodosPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <PublicOnlyRoute />,
    children: [
      {index: true, element: <LoginPage />},
    ]
  },
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
					{ path: 'comisiones', element: <ComisionesPage /> },
					{ path: 'comisiones/periodos', element: <PeriodosPage /> },
				],
			},
		],
	},
])