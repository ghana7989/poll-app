import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface VoteEvent {
	id: string
	optionLabel: string
	timestamp: Date
}

interface VoteTimelineProps {
	results: Record<string, number>
	options: Array<{ id: string; label: string }>
	pollId: string
}

export function VoteTimeline({ results, options, pollId }: VoteTimelineProps) {
	const [voteEvents, setVoteEvents] = useState<VoteEvent[]>([])
	const [previousResults, setPreviousResults] =
		useState<Record<string, number>>(results)
	const scrollRef = useRef<HTMLDivElement>(null)

	// Detect new votes by comparing results
	useEffect(() => {
		// Skip on initial mount
		if (Object.keys(previousResults).length === 0) {
			setPreviousResults(results)
			return
		}

		// Find which option got new votes
		for (const optionId in results) {
			const currentVotes = results[optionId] || 0
			const previousVotes = previousResults[optionId] || 0

			if (currentVotes > previousVotes) {
				const option = options.find((opt) => opt.id === optionId)
				if (option) {
					const newVoteCount = currentVotes - previousVotes

					// Add vote events for each new vote
					for (let i = 0; i < newVoteCount; i++) {
						const newEvent: VoteEvent = {
							id: `${optionId}-${Date.now()}-${i}`,
							optionLabel: option.label,
							timestamp: new Date(),
						}

						setVoteEvents((prev) => {
							const updated = [newEvent, ...prev]
							// Keep only last 15 events
							return updated.slice(0, 15)
						})
					}
				}
			}
		}

		setPreviousResults(results)
	}, [results, options, previousResults])

	// Auto-scroll to top when new vote arrives
	useEffect(() => {
		if (scrollRef.current && voteEvents.length > 0) {
			scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}, [voteEvents.length])

	const totalVotes = Object.values(results).reduce(
		(sum, count) => sum + count,
		0
	)

	return (
		<Card className='glass-strong flex flex-col h-full'>
			<CardHeader className='pb-2 pt-3 px-4 shrink-0'>
				<div className='flex items-center justify-between'>
					<CardTitle className='text-sm font-medium flex items-center gap-1.5'>
						<Activity className='h-4 w-4 text-primary' />
						Live Activity
					</CardTitle>
					{voteEvents.length > 0 && (
						<Badge variant='outline' className='text-xs'>
							{voteEvents.length}
						</Badge>
					)}
				</div>
			</CardHeader>
			<CardContent className='flex-1 overflow-hidden px-4 pb-4'>
				<div
					ref={scrollRef}
					className='space-y-2 h-full max-h-40 overflow-y-auto pr-1 custom-scrollbar'
				>
					{voteEvents.length === 0 ? (
						<div className='text-center py-6'>
							<Activity className='h-6 w-6 text-muted-foreground mx-auto mb-2' />
							<p className='text-xs text-muted-foreground'>
								{totalVotes === 0
									? 'Waiting for votes...'
									: 'Real-time votes appear here'}
							</p>
						</div>
					) : (
						<AnimatePresence initial={false}>
							{voteEvents.slice(0, 5).map((event, index) => (
								<motion.div
									key={event.id}
									initial={{ opacity: 0, x: 10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -10 }}
									transition={{ duration: 0.2, delay: index * 0.02 }}
									className='glass p-2 rounded-md border border-border/50 text-xs'
								>
									<div className='flex items-center gap-2'>
										<div className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0' />
										<span className='truncate'>
											Voted for{' '}
											<span className='text-primary font-medium'>
												{event.optionLabel}
											</span>
										</span>
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
