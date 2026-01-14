import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { getConfig } from './config'
import type { Database } from './types'

let supabaseInstance: SupabaseClient<Database> | null = null

/**
 * Get or create the Supabase client instance
 * Lazy initialization ensures config is loaded before client creation
 */
function getSupabaseClient(): SupabaseClient<Database> {
	if (!supabaseInstance) {
		const config = getConfig()
		supabaseInstance = createClient<Database>(
			config.supabaseUrl,
			config.supabasePublishableDefaultKey
		)
	}
	return supabaseInstance
}

// Export as a getter to ensure lazy initialization
export const supabase = new Proxy({} as SupabaseClient<Database>, {
	get: (_target, prop) => {
		const client = getSupabaseClient()
		return (client as SupabaseClient<Database>)[
			prop as keyof SupabaseClient<Database>
		]
	},
})
