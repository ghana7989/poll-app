import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function usePollResults(pollId: string | undefined) {
	const queryClient = useQueryClient()

	const query = useQuery({
		queryKey: ['poll-results', pollId],
		queryFn: async () => {
			if (!pollId) throw new Error('Poll ID is required')

			const { data, error } = await supabase
				.from('votes')
				.select('option_id')
				.eq('poll_id', pollId)

			if (error) throw error

			// Count votes per option
			const voteCounts = data.reduce(
				(acc, vote) => {
					acc[vote.option_id] = (acc[vote.option_id] || 0) + 1
					return acc
				},
				{} as Record<string, number>
			)

			return voteCounts
		},
		enabled: !!pollId,
		refetchInterval: false, // Rely on realtime instead
	})

	// Subscribe to realtime updates
	useEffect(() => {
		if (!pollId) return

		let channel: RealtimeChannel

		const setupRealtimeSubscription = async () => {
			channel = supabase
				.channel(`poll-${pollId}`)
				.on(
					'postgres_changes',
					{
						event: 'INSERT',
						schema: 'public',
						table: 'votes',
						filter: `poll_id=eq.${pollId}`,
					},
					(payload) => {
						// Update cache with new vote
						queryClient.setQueryData<Record<string, number>>(
							['poll-results', pollId],
							(old = {}) => {
								const optionId = (payload.new as any).option_id
								return {
									...old,
									[optionId]: (old[optionId] || 0) + 1,
								}
							}
						)
					}
				)
				.subscribe()
		}

		setupRealtimeSubscription()

		return () => {
			if (channel) {
				supabase.removeChannel(channel)
			}
		}
	}, [pollId, queryClient])

	return query
}
