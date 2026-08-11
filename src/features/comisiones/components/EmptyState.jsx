export function EmptyState({ message }) {
  return (
    <div className='flex items-center justify-center p-8 bg-surface rounded-lg border border-on-surface-variant/10'>
      <p className='text-on-surface-variant text-sm'>{message}</p>
    </div>
  )
}
