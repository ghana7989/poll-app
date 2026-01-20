import { z } from 'zod'
import { POLL_LIMITS, POLL_VISIBILITY, POLL_TYPE } from './constants'

/**
 * Zod validation schemas for poll creation and voting
 */

export const pollOptionSchema = z.object({
	id: z.string().optional(),
	label: z
		.string()
		.min(1, 'Option cannot be empty')
		.max(
			POLL_LIMITS.MAX_OPTION_LENGTH,
			`Option must be ${POLL_LIMITS.MAX_OPTION_LENGTH} characters or less`
		),
	position: z.number().optional(),
})

export const createPollSchema = z.object({
	title: z
		.string()
		.min(1, 'Title is required')
		.max(
			POLL_LIMITS.MAX_TITLE_LENGTH,
			`Title must be ${POLL_LIMITS.MAX_TITLE_LENGTH} characters or less`
		),
	description: z
		.string()
		.max(
			POLL_LIMITS.MAX_DESCRIPTION_LENGTH,
			`Description must be ${POLL_LIMITS.MAX_DESCRIPTION_LENGTH} characters or less`
		)
		.optional(),
	type: z.enum([POLL_TYPE.SINGLE, POLL_TYPE.MULTIPLE]),
	visibility: z.enum([
		POLL_VISIBILITY.PUBLIC,
		POLL_VISIBILITY.UNLISTED,
		POLL_VISIBILITY.PRIVATE,
	]),
	options: z
		.array(pollOptionSchema)
		.min(
			POLL_LIMITS.MIN_OPTIONS,
			`At least ${POLL_LIMITS.MIN_OPTIONS} options required`
		)
		.max(
			POLL_LIMITS.MAX_OPTIONS,
			`Maximum ${POLL_LIMITS.MAX_OPTIONS} options allowed`
		),
	maxSelections: z.number().min(1).optional(),
	showResultsBeforeVote: z.boolean().default(true),
	requireAuthToVote: z.boolean().default(false),
	allowEmbed: z.boolean().default(true),
	allowComments: z.boolean().default(true),
	closesAt: z.date().optional(),
})

export const voteSchema = z.object({
	pollId: z.string().uuid(),
	optionIds: z.array(z.string().uuid()).min(1, 'Select at least one option'),
	voterFingerprint: z.string(),
})

export const updatePollSchema = z.object({
	title: z.string().max(POLL_LIMITS.MAX_TITLE_LENGTH).optional(),
	description: z.string().max(POLL_LIMITS.MAX_DESCRIPTION_LENGTH).optional(),
	status: z.enum(['active', 'closed']).optional(),
})

export type PollOption = z.infer<typeof pollOptionSchema>
export type CreatePollInput = z.infer<typeof createPollSchema>
export type VoteInput = z.infer<typeof voteSchema>
export type UpdatePollInput = z.infer<typeof updatePollSchema>
