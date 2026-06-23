import { Package, ShoppingCart, Truck } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'
import { Sidebar, SidebarItem } from './components/ui/Sidebar'
import { useCurrentUser } from './core/services/users'

function App() {
	const { data: user } = useCurrentUser()

	return (
		<main className='App bg-background flex h-screen overflow-hidden'>
			<Sidebar user={user}>
				<NavLink to='/cargas'>
					{({ isActive }) => (
						<SidebarItem
							icon={<Truck size={30} />}
							text='Cargas'
							active={isActive}
						/>
					)}
				</NavLink>
				<NavLink to='/ventas'>
					{({ isActive }) => (
						<SidebarItem
							icon={<ShoppingCart size={30} />}
							text='Ventas'
							active={isActive}
						/>
					)}
				</NavLink>
				<NavLink to='/productos'>
					{({ isActive }) => (
						<SidebarItem
							icon={<Package size={30} />}
							text='Productos'
							active={isActive}
						/>
					)}
				</NavLink>
			</Sidebar>
			<div className='flex-1 overflow-auto'>
				<Outlet />
			</div>
		</main>
	)
}
export default App
