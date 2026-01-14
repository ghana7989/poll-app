import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'

export function useRecentPolls(limit = 6) {
	return useQuery({
		queryKey: ['recent-polls', limit],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('polls')
				.select(
					`
					id,
					slug,
					title,
					created_at,
					options:poll_options(id),
					votes:votes(id)
				`
				)
				.eq('visibility', 'public')
				.order('created_at', { ascending: false })
				.limit(limit)

			if (error) throw error

			// Transform to include counts
			return data.map((poll) => ({
				...poll,
				optionCount: poll.options?.length || 0,
				voteCount: poll.votes?.length || 0,
			}))
		},
		refetchInterval: 10000, // Refetch every 10 seconds for live feel
	})
}
