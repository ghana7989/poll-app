import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { useAuth } from './use-auth'

export function usePolls() {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['polls', user?.id],
		queryFn: async () => {
			if (!user) throw new Error('Must be authenticated')

			const { data, error } = await supabase
				.from('polls')
				.select(
					`
					*,
					options:poll_options(id),
					votes:votes(id)
				`
				)
				.eq('creator_id', user.id)
				.order('created_at', { ascending: false })

			if (error) throw error

			// Transform to include vote counts
			return data.map((poll) => ({
				...poll,
				optionCount: poll.options?.length || 0,
				voteCount: poll.votes?.length || 0,
			}))
		},
		enabled: !!user,
	})
}
