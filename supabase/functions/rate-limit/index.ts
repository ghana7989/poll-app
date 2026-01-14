import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RateLimitRequest {
	identifier: string
	action: 'vote' | 'create_poll'
}

const RATE_LIMITS = {
	vote: { count: 10, windowMinutes: 1 }, // 10 votes per minute
	create_poll: { count: 5, windowMinutes: 5 }, // 5 polls per 5 minutes
}

Deno.serve(async (req) => {
	// Handle CORS preflight requests
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders })
	}

	try {
		const supabaseClient = createClient(
			Deno.env.get('SUPABASE_URL') ?? '',
			Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
		)

		const { identifier, action } = (await req.json()) as RateLimitRequest

		if (!identifier || !action) {
			return new Response(
				JSON.stringify({ error: 'Missing identifier or action' }),
				{
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			)
		}

		const limit = RATE_LIMITS[action]
		if (!limit) {
			return new Response(
				JSON.stringify({ error: 'Invalid action' }),
				{
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			)
		}

		// Calculate window start time
		const now = new Date()
		const windowStart = new Date(
			now.getTime() - limit.windowMinutes * 60 * 1000
		)

		// Clean up old rate limit entries
		await supabaseClient
			.from('rate_limits')
			.delete()
			.lt('window_start', windowStart.toISOString())

		// Get current count for this identifier and action
		const { data: existingLimits, error: fetchError } = await supabaseClient
			.from('rate_limits')
			.select('*')
			.eq('identifier', identifier)
			.eq('action', action)
			.gte('window_start', windowStart.toISOString())

		if (fetchError) throw fetchError

		const currentCount = existingLimits?.length || 0

		// Check if limit exceeded
		if (currentCount >= limit.count) {
			const oldestEntry = existingLimits?.[0]
			const retryAfter = oldestEntry
				? Math.ceil(
						(new Date(oldestEntry.window_start).getTime() +
							limit.windowMinutes * 60 * 1000 -
							now.getTime()) /
							1000
					)
				: limit.windowMinutes * 60

			return new Response(
				JSON.stringify({
					allowed: false,
					retryAfter,
					message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
				}),
				{
					status: 429,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			)
		}

		// Add new rate limit entry
		const { error: insertError } = await supabaseClient
			.from('rate_limits')
			.insert({
				identifier,
				action,
				count: 1,
				window_start: now.toISOString(),
			})

		if (insertError) throw insertError

		return new Response(
			JSON.stringify({
				allowed: true,
				remaining: limit.count - currentCount - 1,
			}),
			{
				status: 200,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		)
	} catch (error) {
		return new Response(
			JSON.stringify({ error: error.message }),
			{
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		)
	}
})
