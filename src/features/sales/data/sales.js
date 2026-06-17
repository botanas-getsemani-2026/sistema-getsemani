import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSupabaseClient } from '../../../core/providers/hooks/useSupabase'

export const useSalesQueries = (filter, page = 1, pageSize = 50) => {
	const client = useSupabaseClient()

	const fetchSales = async ({ filter, page, pageSize }) => {
		const from = (page - 1) * pageSize
		const to = from + pageSize - 1

		let query = client
			.from('ventas')
			.select(
				`
				id,
				fecha_venta,
				total,
				tienda_id,
				registrante,
				tiendas:tienda_id ( id ),
				perfiles:registrante ( id, nombre, papellido, email ),
				ventas_detalle ( id )
				`,
				{ count: 'exact' },
			)
			.order('fecha_venta', { ascending: false })
			.range(from, to)

		if (filter?.type === 'vendedor' && filter.value) {
			query = query.eq('registrante', filter.value)
		}

		if (filter?.type === 'tienda' && filter.value) {
			query = query.eq('tienda_id', filter.value.toUpperCase())
		}

		if (filter?.type === 'fecha' && filter.value) {
			const start = filter.value.from
				? new Date(filter.value.from).toISOString()
				: new Date(`${filter.value}T00:00:00`).toISOString()
			const end = filter.value.to
				? new Date(filter.value.to).toISOString()
				: new Date(`${filter.value}T23:59:59.999`).toISOString()
			query = query.gte('fecha_venta', start).lte('fecha_venta', end)
		}

		const { data, error, count } = await query
		if (error) throw error

		const sales = (data ?? []).map(v => ({
			id: v.id,
			date: v.fecha_venta,
			total: v.total,
			storeId: v.tienda_id,
			vendor: v.perfiles
				? `${v.perfiles.nombre ?? ''} ${v.perfiles.papellido ?? ''}`.trim()
				: '—',
			vendorUser: v.perfiles?.email ?? null,
			productsCount: Array.isArray(v.ventas_detalle)
				? v.ventas_detalle.length
				: 0,
		}))
		return { sales, total: count ?? 0 }
	}

	const { data, isLoading, isFetching, isError, refetch } = useQuery({
		queryKey: ['sales', filter, page, pageSize],
		queryFn: () => fetchSales({ filter, page, pageSize }),
		placeholderData: keepPreviousData,
		enabled: !!filter?.value,
	})

	return {
		sales: data?.sales ?? [],
		total: data?.total ?? 0,
		isLoading,
		isFetching,
		isError,
		refetch,
	}
}
