import { Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Sidebar, SidebarItem } from './components/ui/Sidebar'
import { useUsersQueries } from './features/stockLoad/data/users'
import { StockLoadPage } from './features/stockLoad/StockLoadPage'

function App() {
	const [activeView, setActiveView] = useState('cargas')
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
			</Sidebar>
			<div className='flex-1 overflow-auto'>
				{activeView === 'cargas' && <StockLoadPage />}
			</div>
		</main>
	)
}

export default App
