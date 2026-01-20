import { useAuthActions } from '@convex-dev/auth/react'
import { useConvexAuth, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

/**
 * Hook to use authentication state and methods
 * Uses Convex Auth with Google OAuth
 */
export function useAuth() {
	const { isLoading, isAuthenticated } = useConvexAuth()
	const { signIn, signOut } = useAuthActions()
	const viewer = useQuery(api.users.viewer)

	return {
		user: viewer ?? null,
		session: viewer ? { user: viewer } : null,
		loading: isLoading || (isAuthenticated && viewer === undefined),
		initialized: !isLoading && (!isAuthenticated || viewer !== undefined),
		signInWithGoogle: async () => {
			await signIn('google', { redirectTo: window.location.origin })
		},
		signOut: async () => {
			await signOut()
		},
	}
}

export const useAuthStore = useAuth
