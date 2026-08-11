import { Package, ShoppingCart, Truck, Users, Wallet } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'
import { Sidebar, SidebarItem } from './components/ui/Sidebar'
import { useCurrentUser } from './core/services/users'
import { useSupabaseContext } from './core/providers/hooks/useSupabase'

function App() {
  const { user } = useSupabaseContext()
	const { data: currentUser } = useCurrentUser(user?.id)

	return (
		<main className='App bg-background flex h-screen overflow-hidden'>
			<Sidebar user={currentUser}>
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
				<NavLink to='/vendedores'>
					{({ isActive }) => (
						<SidebarItem
							icon={<Users size={30} />}
							text='Vendedores'
							active={isActive}
						/>
					)}
				</NavLink>
				<NavLink to='/comisiones'>
					{({ isActive }) => (
						<SidebarItem
							icon={<Wallet size={30} />}
							text='Comisiones'
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