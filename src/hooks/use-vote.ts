import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { getHashedFingerprint } from '@/utils/fingerprint'
import { LOCAL_STORAGE_KEYS } from '@/utils/constants'
import type { Id } from '../../convex/_generated/dataModel'

interface VoteInput {
	pollId: Id<'polls'>
	optionIds: Id<'poll_options'>[]
}

export function useVote() {
	const castVote = useMutation(api.votes.cast)

	return {
		mutateAsync: async ({ pollId, optionIds }: VoteInput) => {
			// Get fingerprint
			const voterFingerprint = await getHashedFingerprint()

			// Check if already voted (local storage)
			const votedPolls = JSON.parse(
				localStorage.getItem(LOCAL_STORAGE_KEYS.VOTED_POLLS) || '{}'
			)
			if (votedPolls[pollId]) {
				throw new Error('You have already voted on this poll')
			}

			// Cast vote via Convex
			await castVote({
				pollId,
				optionIds,
				voterFingerprint,
			})

			// Mark as voted in local storage
			votedPolls[pollId] = true
			localStorage.setItem(LOCAL_STORAGE_KEYS.VOTED_POLLS, JSON.stringify(votedPolls))

			return { pollId, optionIds }
		},
		mutate: async ({ pollId, optionIds }: VoteInput) => {
			// Get fingerprint
			const voterFingerprint = await getHashedFingerprint()

			// Check if already voted (local storage)
			const votedPolls = JSON.parse(
				localStorage.getItem(LOCAL_STORAGE_KEYS.VOTED_POLLS) || '{}'
			)
			if (votedPolls[pollId]) {
				throw new Error('You have already voted on this poll')
			}

			// Cast vote via Convex
			await castVote({
				pollId,
				optionIds,
				voterFingerprint,
			})

			// Mark as voted in local storage
			votedPolls[pollId] = true
			localStorage.setItem(LOCAL_STORAGE_KEYS.VOTED_POLLS, JSON.stringify(votedPolls))
		},
	}
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
