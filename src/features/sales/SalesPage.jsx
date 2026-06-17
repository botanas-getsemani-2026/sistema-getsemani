import { Funnel } from 'lucide-react'
import { useState } from 'react'
import { SalesFilters } from './components/SalesFilters'
import { SalesTable } from './components/SalesTable'
import { useSalesQueries } from './data/sales'
import { useUsers } from '../../core/services/users'

export function SalesPage() {
	const [showFilters, setShowFilters] = useState(false)
	const [selectedFilterType, setSelectedFilterType] = useState('')
	const [selectedFilterValue, setSelectedFilterValue] = useState('')
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(50)

	const activeFilter = { type: selectedFilterType, value: selectedFilterValue }
	const { sales, total, isLoading, isFetching } = useSalesQueries(
		activeFilter,
		page,
		pageSize,
	)
	const { data: users } = useUsers()

	const handleFilterTypeChange = type => {
		setSelectedFilterType(type)
		setSelectedFilterValue('')
		setPage(1)
	}

	const handleFilterValueChange = value => {
		setSelectedFilterValue(value)
		setPage(1)
	}

	const handlePageSizeChange = size => {
		setPageSize(size)
		setPage(1)
	}

	const handleShowFilters = () => {
		setShowFilters(prev => {
			const next = !prev
			if (!next) {
				setSelectedFilterType('')
				setSelectedFilterValue('')
				setPage(1)
			}
			return next
		})
	}

	return (
		<section className='p-6 space-y-6'>
			<header className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold text-on-background'>Ventas</h1>
				<button
					type='button'
					title='Filtros'
					aria-expanded={showFilters}
					aria-label='Mostrar u ocultar filtros'
					onClick={handleShowFilters}
				>
					<Funnel
						className={`text-on-background size-6 cursor-pointer transition-colors hover:fill-primary/90 ${showFilters ? 'text-primary fill-primary' : ''}`}
					/>
				</button>
			</header>
			{showFilters && (
				<SalesFilters
					vendors={users}
					selectedFilterType={selectedFilterType}
					selectedFilterValue={selectedFilterValue}
					onFilterTypeChange={handleFilterTypeChange}
					onFilterValueChange={handleFilterValueChange}
				/>
			)}

			<section>
				<SalesTable
					sales={sales}
					total={total}
					page={page}
					pageSize={pageSize}
					isLoading={isLoading}
					isFetching={isFetching}
					filter={activeFilter}
					onPageChange={setPage}
					onPageSizeChange={handlePageSizeChange}
				/>
			</section>
		</section>
	)
}
