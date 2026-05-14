import { Truck } from 'lucide-react'
import { Sidebar, SidebarItem } from './components/Sidebar'

function App() {
	return (
		<main className='App bg-surface'>
			<Sidebar>
				<SidebarItem icon={<Truck size={30}/>} text={'Cargas'} active alert />
			</Sidebar>
		</main>
	)
}

export default App
