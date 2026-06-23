import { useEffect } from 'react'
import { useRef } from 'react'

export function ConfirmModal({ isOpen, onClose, onConfirm, title, content }) {
	const dialogRef = useRef(null)

	useEffect(() => {
		if (isOpen) {
			dialogRef.current?.showModal()
		} else {
			dialogRef.current?.close()
		}
	}, [isOpen])

	return (
		<dialog
			ref={dialogRef}
			className='bg-surface border border-outline rounded-lg shadow-xl w-full max-w-md p-6 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-black/50'
			onCancel={onClose}
		>
			<section className='flex flex-col justify-center items-center'>
				<h3 className='text-lg font-semibold align-center mb-4 text-on-surface-variant'>
					{title}
				</h3>
				<p className='text-center text-on-surface-variant mb-1'>{content}</p>
				<section className='flex gap-4 mt-4'>
					<button
						className='bg-secondary hover:bg-secondary/80 text-on-secondary py-2 px-4 rounded'
						onClick={onClose}
					>
						Cancelar
					</button>
					<button
						className='bg-primary hover:bg-primary/80 text-on-primary py-2 px-4 rounded'
						onClick={onConfirm}
					>
						Confirmar
					</button>
				</section>
			</section>
		</dialog>
	)
}
