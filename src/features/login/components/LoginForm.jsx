import { EyeClosed } from 'lucide-react'
import { Eye } from 'lucide-react'
import { useState } from 'react'
import logoImage from '@/assets/getsemani-logo-v3-name.webp'

export default function LoginForm({
	username,
	password,
	onUsernameChange,
	onPasswordChange,
	onSubmit,
}) {
	const [showPassword, setShowPassword] = useState(false)

	const handleShowPassword = () => {
		setShowPassword(!showPassword)
	}

	return (
		<form
			onSubmit={onSubmit}
			className='bg-on-primary-container flex flex-col justify-center items-center gap-8 w-1/3 h-1/2 p-8 border rounded-md'
		>
			<img src={logoImage} alt='Getsemani Logo' />
			<input
				className='w-full p-2 border border-on-primary rounded-sm text-primary-container text-lg focus:outline-none focus:ring-primary-container focus:ring-1'
				name='username'
				type='text'
				placeholder='usuario1234'
				value={username}
				onChange={e => onUsernameChange(e.target.value)}
				required
			/>
			<div className='flex justify-center items-center w-full border border-on-primary rounded-sm text-primary-container text-lg'>
				<input
					className='w-full p-2 focus:outline-none'
					name='password'
					value={password}
					type={showPassword ? 'text' : 'password'}
					placeholder='contraseña'
					onChange={e => onPasswordChange(e.target.value)}
					required
				/>
				<button
					className='p-2 text-lg text-primary-container hover:text-primary-container/80'
					type='button'
					onClick={handleShowPassword}
				>
					{showPassword ? <Eye /> : <EyeClosed />}
				</button>
			</div>
			<button
				className='border border-on-primary rounded-md bg-primary-container w-1/2 text-on-primary-container h-10 text-lg font-semibold cursor-pointer hover:bg-primary-container/90 transition-colors'
				type='submit'
			>
				Iniciar sesión
			</button>
		</form>
	)
}
