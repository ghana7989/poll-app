import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

export function usePollResults(pollId: Id<'polls'> | undefined) {
	// Convex queries are automatically reactive - no manual subscriptions needed!
	const data = useQuery(api.polls.getResults, pollId ? { pollId } : 'skip')
	
	return {
		data,
		isLoading: data === undefined,
	}
}
