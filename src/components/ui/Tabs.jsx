export function Tabs({ value, onValueChange, tabs, className = '' }) {
	return (
		<div
			role='tablist'
			aria-orientation='horizontal'
			className={`flex border-b border-on-surface-variant/20 ${className}`}
		>
			{tabs.map(tab => {
				const isActive = tab.value === value
				const showBadge =
					typeof tab.badge === 'number' && tab.badge > 0
				return (
					<button
						key={tab.value}
						type='button'
						role='tab'
						aria-selected={isActive}
						aria-controls={`tabpanel-${tab.value}`}
						id={`tab-${tab.value}`}
						onClick={() => onValueChange?.(tab.value)}
						className={`relative px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 -mb-px border-b-2 ${
							isActive
								? 'text-primary border-primary'
								: 'text-on-surface-variant border-transparent hover:text-on-background'
						}`}
					>
						<span>{tab.label}</span>
						{showBadge && (
							<span className='inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-semibold bg-surface-variant text-on-background'>
								{tab.badge}
							</span>
						)}
					</button>
				)
			})}
		</div>
	)
}
