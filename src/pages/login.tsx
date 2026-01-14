import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from '@/hooks/use-auth'
import { LoginButton } from '@/components/auth/login-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function LoginPage() {
	const { user } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		if (user) {
			// Redirect to the page they were trying to access, or dashboard
			const from = (location.state as any)?.from?.pathname || '/dashboard'
			navigate(from, { replace: true })
		}
	}, [user, navigate, location])

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="glass-strong w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Welcome to Pollify</CardTitle>
					<CardDescription>Sign in to create and manage your polls</CardDescription>
				</CardHeader>
				<CardContent>
					<LoginButton />
				</CardContent>
			</Card>
		</div>
	)
}
