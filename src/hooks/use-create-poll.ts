import { useMutation } from 'convex/react'
import { useNavigate } from 'react-router'
import { api } from '../../convex/_generated/api'
import { getHashedFingerprint } from '@/utils/fingerprint'
import type { CreatePollInput } from '@/utils/validators'

export function useCreatePoll() {
	const navigate = useNavigate()
	const createPoll = useMutation(api.polls.create)

	return {
		mutateAsync: async (input: CreatePollInput) => {
			const fingerprint = await getHashedFingerprint()

			const result = await createPoll({
				title: input.title,
				description: input.description,
				type: input.type,
				visibility: input.visibility,
				options: input.options.map((option, index) => ({
					label: option.label,
					position: index,
				})),
				maxSelections: input.type === 'multiple' ? input.maxSelections : undefined,
				showResultsBeforeVote: input.showResultsBeforeVote,
				requireAuthToVote: input.requireAuthToVote,
				allowEmbed: input.allowEmbed,
				allowComments: input.allowComments,
				closesAt: input.closesAt ? input.closesAt.getTime() : undefined,
				fingerprint,
			})

			navigate(`/poll/${result.slug}`)
			return result
		},
		mutate: async (input: CreatePollInput) => {
			const fingerprint = await getHashedFingerprint()

			const result = await createPoll({
				title: input.title,
				description: input.description,
				type: input.type,
				visibility: input.visibility,
				options: input.options.map((option, index) => ({
					label: option.label,
					position: index,
				})),
				maxSelections: input.type === 'multiple' ? input.maxSelections : undefined,
				showResultsBeforeVote: input.showResultsBeforeVote,
				requireAuthToVote: input.requireAuthToVote,
				allowEmbed: input.allowEmbed,
				allowComments: input.allowComments,
				closesAt: input.closesAt ? input.closesAt.getTime() : undefined,
				fingerprint,
			})

			navigate(`/poll/${result.slug}`)
		},
		isPending: false,
	}
}
