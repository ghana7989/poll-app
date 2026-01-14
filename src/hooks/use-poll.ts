import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'

export function usePoll(slug: string | undefined) {
	return useQuery({
		queryKey: ['poll', slug],
		queryFn: async () => {
			if (!slug) throw new Error('Slug is required')

			const { data: poll, error: pollError } = await supabase
				.from('polls')
				.select(
					`
					*,
					creator:profiles(id, full_name, avatar_url),
					options:poll_options(*)
				`
				)
				.eq('slug', slug)
				.order('position', { referencedTable: 'poll_options', ascending: true })
				.single()

			if (pollError) throw pollError

			return poll
		},
		enabled: !!slug,
	})
}
