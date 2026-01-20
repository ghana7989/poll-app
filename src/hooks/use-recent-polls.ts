import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export function useRecentPolls(limit = 6) {
	const data = useQuery(api.polls.listRecent, { limit })
	
	return {
		data,
		isLoading: data === undefined,
	}
}
