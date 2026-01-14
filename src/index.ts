/* eslint-disable @typescript-eslint/no-explicit-any */
export default {
	async fetch(request: Request, env: any) {
		const url = new URL(request.url)

		if (url.pathname === '/api/config') {
			return Response.json({
				supabaseUrl: env.SUPABASE_URL,
				supabasePublishableDefaultKey: env.SUPABASE_PUBLISHABLE_DEFAULT_KEY,
				appUrl: env.APP_URL,
				appName: env.APP_NAME,
			})
		}

		return env.ASSETS.fetch(request)
	},
}
