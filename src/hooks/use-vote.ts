import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { getHashedFingerprint } from '@/utils/fingerprint'
import { useAuth } from './use-auth'
import { LOCAL_STORAGE_KEYS } from '@/utils/constants'

interface VoteInput {
	pollId: string
	optionIds: string[]
}

export function useVote() {
	const { user } = useAuth()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ pollId, optionIds }: VoteInput) => {
			// Get fingerprint
			const fingerprint = await getHashedFingerprint()

			// Check if already voted (local storage)
			const votedPolls = JSON.parse(
				localStorage.getItem(LOCAL_STORAGE_KEYS.VOTED_POLLS) || '{}'
			)
			if (votedPolls[pollId]) {
				throw new Error('You have already voted on this poll')
			}

			// Insert votes
			const votes = optionIds.map((optionId) => ({
				poll_id: pollId,
				option_id: optionId,
				voter_id: user?.id || null,
				voter_fingerprint: fingerprint,
			}))

			const { error } = await supabase.from('votes').insert(votes)

			if (error) {
				// Check if it's a duplicate vote error
				if (error.code === '23505') {
					// Unique violation
					throw new Error('You have already voted on this poll')
				}
				throw error
			}

			// Mark as voted in local storage
			votedPolls[pollId] = true
			localStorage.setItem(LOCAL_STORAGE_KEYS.VOTED_POLLS, JSON.stringify(votedPolls))

			return { pollId, optionIds }
		},
		onSuccess: ({ pollId }) => {
			// Invalidate poll results to refetch
			queryClient.invalidateQueries({ queryKey: ['poll-results', pollId] })
		},
	})
}

/**
 * Check if user has already voted on a poll (via local storage)
 */
export function hasVoted(pollId: string): boolean {
	const votedPolls = JSON.parse(
		localStorage.getItem(LOCAL_STORAGE_KEYS.VOTED_POLLS) || '{}'
	)
	return !!votedPolls[pollId]
}
