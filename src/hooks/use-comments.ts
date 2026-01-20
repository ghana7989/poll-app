import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { getHashedFingerprint } from '@/utils/fingerprint'
import type { Id } from '../../convex/_generated/dataModel'

/**
 * Hook to fetch and subscribe to comments for a poll
 * Convex queries are automatically reactive - no manual subscriptions needed!
 */
export function useComments(pollId: Id<'polls'> | undefined) {
	const data = useQuery(api.comments.list, pollId ? { pollId } : 'skip')
	
	return {
		data,
		isLoading: data === undefined,
	}
}

/**
 * Hook to add a new comment to a poll
 */
export function useAddComment() {
	const createComment = useMutation(api.comments.create)

	return {
		mutateAsync: async ({
			pollId,
			content,
		}: {
			pollId: Id<'polls'>
			content: string
		}) => {
			const commenterFingerprint = await getHashedFingerprint()

			return await createComment({
				pollId,
				content,
				commenterFingerprint,
			})
		},
		mutate: async ({
			pollId,
			content,
		}: {
			pollId: Id<'polls'>
			content: string
		}) => {
			const commenterFingerprint = await getHashedFingerprint()

			await createComment({
				pollId,
				content,
				commenterFingerprint,
			})
		},
	}
}

/**
 * Hook to delete a comment
 * Users can delete their own comments, and poll creators can delete any comment on their polls
 */
export function useDeleteComment() {
	const deleteCommentMutation = useMutation(api.comments.deleteComment)

	return {
		mutateAsync: async ({ commentId }: { commentId: Id<'comments'> }) => {
			return await deleteCommentMutation({ commentId })
		},
		mutate: async ({ commentId }: { commentId: Id<'comments'> }) => {
			await deleteCommentMutation({ commentId })
		},
		isPending: false, // Will be managed by Convex internally
	}
}
