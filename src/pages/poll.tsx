import { useState, useMemo } from 'react'
import { useParams } from 'react-router'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { usePoll } from '@/hooks/use-poll'
import { usePollResults } from '@/hooks/use-poll-results'
import { useVote, hasVoted } from '@/hooks/use-vote'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { ShareModal } from '@/components/poll/share-modal'
import { PollHeader } from '@/components/poll/poll-header'
import { PollStatistics } from '@/components/poll/poll-statistics'
import { ChartVisualizations } from '@/components/poll/chart-visualizations'
import { VoteTimeline } from '@/components/poll/vote-timeline'
import { toast } from 'sonner'

export function PollPage() {
	const { slug } = useParams()
	const { data: poll, isLoading } = usePoll(slug)
	const { data: results } = usePollResults(poll?.id)
	const vote = useVote()
	const [selectedOptions, setSelectedOptions] = useState<string[]>([])
	const [showShareModal, setShowShareModal] = useState(false)
	const [isPulsing, setIsPulsing] = useState(false)

	const alreadyVoted = poll ? hasVoted(poll.id) : false

	// Calculate total votes - must be before useMemo
	const totalVotes = results
		? Object.values(results).reduce((sum, count) => sum + count, 0)
		: 0

	// Calculate leading option - moved before early returns to comply with Rules of Hooks
	const leadingOption = useMemo(() => {
		if (!poll?.options || !results || totalVotes === 0) return null

		let leading = poll.options[0]
		let maxVotes = results[leading.id] || 0

		for (const option of poll.options) {
			const votes = results[option.id] || 0
			if (votes > maxVotes) {
				maxVotes = votes
				leading = option
			}
		}

		return {
			label: leading.label,
			votes: maxVotes,
			percentage: (maxVotes / totalVotes) * 100,
		}
	}, [poll?.options, results, totalVotes])

	if (isLoading) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<Spinner className='h-8 w-8' />
			</div>
		)
	}

	if (!poll) {
		return (
			<div className='container mx-auto py-20 text-center'>
				<h1 className='text-2xl font-bold'>Poll not found</h1>
			</div>
		)
	}

	const handleVote = async () => {
		if (selectedOptions.length === 0) {
			toast.error('Please select at least one option')
			return
		}

		try {
			// Success animation
			const confetti = (await import('canvas-confetti')).default

			await vote.mutateAsync({
				pollId: poll.id,
				optionIds: selectedOptions,
			})

			// Trigger confetti
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
			})

			toast.success('Vote submitted!')
			setSelectedOptions([])

			// Pulse statistics
			setIsPulsing(true)
			setTimeout(() => setIsPulsing(false), 1000)
		} catch (error: any) {
			toast.error(error.message || 'Failed to submit vote')
		}
	}

	const handleOptionToggle = (optionId: string) => {
		if (poll.type === 'single') {
			setSelectedOptions([optionId])
		} else {
			setSelectedOptions((prev) =>
				prev.includes(optionId)
					? prev.filter((id) => id !== optionId)
					: [...prev, optionId]
			)
		}
	}

	const canShowResults = poll.show_results_before_vote || alreadyVoted
	const isClosed = poll.status === 'closed'

	return (
		<div className='container mx-auto max-w-5xl px-4 py-6 space-y-4'>
			{/* Poll Header */}
			<PollHeader
				title={poll.title}
				description={poll.description}
				creator={poll.creator}
				createdAt={poll.created_at}
				status={poll.status}
				visibility={poll.visibility}
				pollType={poll.type}
				onShare={() => setShowShareModal(true)}
			/>

			{/* Voting Interface */}
			{!alreadyVoted && !isClosed && (
				<Card className='glass-strong'>
					<CardContent className='p-4'>
						<div className='space-y-3'>
							<h3 className='text-base font-semibold'>Cast Your Vote</h3>
							{poll.type === 'single' ? (
								<RadioGroup
									value={selectedOptions[0]}
									onValueChange={(value) => setSelectedOptions([value])}
									className='space-y-1.5'
								>
									{poll.options?.map((option) => (
										<div
											key={option.id}
											className='glass flex items-center space-x-3 rounded-lg p-3 transition-colors hover:bg-accent/20'
										>
											<RadioGroupItem value={option.id} id={option.id} />
											<Label
												htmlFor={option.id}
												className='flex-1 cursor-pointer text-sm'
											>
												{option.label}
											</Label>
										</div>
									))}
								</RadioGroup>
							) : (
								<div className='space-y-1.5'>
									{poll.options?.map((option) => (
										<div
											key={option.id}
											className='glass flex items-center space-x-3 rounded-lg p-3 transition-colors hover:bg-accent/20'
										>
											<Checkbox
												id={option.id}
												checked={selectedOptions.includes(option.id)}
												onCheckedChange={() => handleOptionToggle(option.id)}
											/>
											<Label
												htmlFor={option.id}
												className='flex-1 cursor-pointer text-sm'
											>
												{option.label}
											</Label>
										</div>
									))}
								</div>
							)}
							<Button
								onClick={handleVote}
								disabled={selectedOptions.length === 0 || vote.isPending}
								className='w-full'
							>
								{vote.isPending ? 'Submitting...' : 'Submit Vote'}
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Already Voted Message */}
			{alreadyVoted && (
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className='glass flex items-center gap-3 rounded-lg border-primary/20 bg-primary/10 p-4'
				>
					<CheckCircle2 className='h-5 w-5 text-primary' />
					<p className='text-sm font-medium'>
						You've already voted on this poll
					</p>
				</motion.div>
			)}

			{/* Results Section */}
			{canShowResults && (
				<div className='space-y-4'>
					{/* Statistics and Timeline Grid */}
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
						{/* Statistics - 2 columns on desktop */}
						<div className='lg:col-span-2'>
							<PollStatistics
								totalVotes={totalVotes}
								leadingOption={leadingOption}
								closesAt={poll.closes_at}
								status={poll.status}
								pollType={poll.type}
								createdAt={poll.created_at}
								isPulsing={isPulsing}
							/>
						</div>

						{/* Vote Timeline - 1 column on desktop */}
						<div className='lg:col-span-1'>
							<VoteTimeline
								results={results || {}}
								options={poll.options || []}
								pollId={poll.id}
							/>
						</div>
					</div>

					{/* Chart Visualizations */}
					<ChartVisualizations
						options={poll.options || []}
						results={results || {}}
						totalVotes={totalVotes}
					/>
				</div>
			)}

			{/* Share Modal */}
			{poll && (
				<ShareModal
					poll={poll}
					isOpen={showShareModal}
					onClose={() => setShowShareModal(false)}
				/>
			)}
		</div>
	)
}
