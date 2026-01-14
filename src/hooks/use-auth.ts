import { create } from 'zustand'
import { supabase } from '@/utils/supabase'
import type { User, Session } from '@supabase/supabase-js'
import { useEffect } from 'react'

interface AuthState {
	user: User | null
	session: Session | null
	loading: boolean
	initialized: boolean
	setUser: (user: User | null) => void
	setSession: (session: Session | null) => void
	setLoading: (loading: boolean) => void
	setInitialized: (initialized: boolean) => void
	signInWithGoogle: () => Promise<void>
	signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	session: null,
	loading: true,
	initialized: false,
	setUser: (user) => set({ user }),
	setSession: (session) => set({ session, user: session?.user ?? null }),
	setLoading: (loading) => set({ loading }),
	setInitialized: (initialized) => set({ initialized }),
	signInWithGoogle: async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: window.location.origin,
			},
		})
		if (error) {
			console.error('Error signing in with Google:', error)
			throw error
		}
	},
	signOut: async () => {
		const { error } = await supabase.auth.signOut()
		if (error) {
			console.error('Error signing out:', error)
			throw error
		}
		set({ user: null, session: null })
	},
}))

/**
 * Hook to use authentication state and methods
 * Also initializes auth state from Supabase session
 */
export function useAuth() {
	const store = useAuthStore()

	useEffect(() => {
		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			store.setSession(session)
			store.setLoading(false)
			store.setInitialized(true)
		})

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			store.setSession(session)
			store.setLoading(false)
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [])

	return store
}
