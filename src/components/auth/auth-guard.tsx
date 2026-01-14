import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from '@/hooks/use-auth'
import { Spinner } from '@/components/ui/spinner'

interface AuthGuardProps {
	children: ReactNode
}

/**
 * Protected route wrapper
 * Redirects to /login if not authenticated
 */
export function AuthGuard({ children }: AuthGuardProps) {
	const { user, loading, initialized } = useAuth()
	const location = useLocation()

	if (!initialized || loading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Spinner className="h-8 w-8" />
			</div>
		)
	}

	if (!user) {
		// Redirect to login with return URL
		return <Navigate to="/login" state={{ from: location }} replace />
	}

	return <>{children}</>
}
