export type AppConfig = {
	supabaseUrl: string
	supabasePublishableDefaultKey: string
	appUrl: string
	appName: string
}

let configCache: AppConfig | null = null

export async function loadConfig(): Promise<AppConfig> {
	if (!configCache) {
		const res = await fetch('/api/config')
		if (!res.ok) throw new Error('Failed to load config')
		configCache = await res.json()
	}
	return configCache!
}

// Synchronous getter - safe after loadConfig() is called in main.tsx
export function getConfig(): AppConfig {
	if (!configCache) {
		throw new Error('Config not loaded! Call loadConfig() first in main.tsx')
	}
	return configCache
}
