export default {
	async fetch(request: Request, env: Env) {
		const url = new URL(request.url)

		// API routes
		if (url.pathname === '/api/config') {
			return Response.json({
				supabaseUrl: env.SUPABASE_URL,
				supabasePublishableDefaultKey: env.SUPABASE_PUBLISHABLE_DEFAULT_KEY,
				appUrl: env.APP_URL,
				appName: env.APP_NAME,
			})
		}

		// Try to serve the static asset
		const response = await env.ASSETS.fetch(request)

		// If asset not found (404), serve index.html for SPA routing
		if (response.status === 404) {
			const indexRequest = new Request(
				new URL('/', request.url).toString(),
				request
			)
			return env.ASSETS.fetch(indexRequest)
		}

		return response
	},
}
