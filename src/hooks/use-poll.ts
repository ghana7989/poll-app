import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export function usePoll(slug: string | undefined) {
	const data = useQuery(api.polls.get, slug ? { slug } : 'skip')
	
	return {
		data,
		isLoading: data === undefined,
	}
}
