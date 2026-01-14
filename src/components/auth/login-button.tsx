import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export function LoginButton() {
	const { signInWithGoogle } = useAuth()
	const [loading, setLoading] = useState(false)

	const handleSignIn = async () => {
		try {
			setLoading(true)
			await signInWithGoogle()
		} catch (error) {
			console.error('Sign in error:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Button onClick={handleSignIn} disabled={loading} size="lg" className="w-full">
			{loading ? 'Signing in...' : 'Continue with Google'}
		</Button>
	)
}
