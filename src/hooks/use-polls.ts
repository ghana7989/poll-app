import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export function usePolls() {
	const data = useQuery(api.polls.list, {})
	
	return {
		data,
		isLoading: data === undefined,
	}
}
