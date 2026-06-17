const dateFormatter = new Intl.DateTimeFormat('es-MX', {
	dateStyle: 'short',
	timeStyle: 'short',
})

export function formatDate(value) {
	if (!value) return '—'
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return '—'
	return dateFormatter.format(date)
}