import { Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Sidebar, SidebarItem } from './components/ui/Sidebar'
import { useUsersQueries } from './core/services/users'
import { StockLoadPage } from './features/stockLoad/StockLoadPage'
import { ShoppingCart } from 'lucide-react'
import { SalesPage } from './features/sales/SalesPage'

function App() {
	const [activeView, setActiveView] = useState('ventas')
	const { user, getCurrentUser } = useUsersQueries()

	useEffect(() => {
		getCurrentUser()
	}, [getCurrentUser])

	return (
		<main className='App bg-background flex'>
			<Sidebar user={user}>
				<SidebarItem
					icon={<Truck size={30} />}
					text={'Cargas'}
					active={activeView === 'cargas'}
					onClick={() => setActiveView('cargas')}
				/>
        <SidebarItem
          icon={<ShoppingCart size={30} />}
          text={'Ventas'}
          active={activeView === 'ventas'}
          onClick={() => setActiveView('ventas')}
        />
			</Sidebar>
			<div className='flex-1 overflow-auto'>
				{activeView === 'cargas' && <StockLoadPage />}
				{activeView === 'ventas' && <SalesPage />}
			</div>
		</main>
	)
}

export default App
