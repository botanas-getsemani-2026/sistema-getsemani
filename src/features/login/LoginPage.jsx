import { useState } from 'react'
import LoginForm from './components/LoginForm'
import { useSignIn } from '../../core/services/auth'
import { EMAIL_DOMAIN } from '../../constants/login'

export default function LoginPage() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const { signIn } = useSignIn()

	const handleOnSubmit = async e => {
		e.preventDefault()
		try {
			const { data, error } = await signIn(`${username}${EMAIL_DOMAIN}`, password)

			console.log('Sign-in response:', data, error)
		} catch (error) {
			console.error('Error signing in:', error)
		}
	}

	return (
		<main className='w-screen h-screen bg-background flex items-center justify-center'>
			<LoginForm
				username={username}
				password={password}
				onUsernameChange={setUsername}
				onPasswordChange={setPassword}
				onSubmit={handleOnSubmit}
			/>
		</main>
	)
}
