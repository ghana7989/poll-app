import { useState } from 'react'
import { useParams } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, CheckCircle2 } from 'lucide-react'
import { usePoll } from '@/hooks/use-poll'
import { usePollResults } from '@/hooks/use-poll-results'
import { useVote, hasVoted } from '@/hooks/use-vote'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { ShareModal } from '@/components/poll/share-modal'
import { toast } from 'sonner'

export function PollPage() {
	const { slug } = useParams()
	const { data: poll, isLoading } = usePoll(slug)
	const { data: results } = usePollResults(poll?.id)
	const vote = useVote()
	const [selectedOptions, setSelectedOptions] = useState<string[]>([])
	const [showShareModal, setShowShareModal] = useState(false)

	const alreadyVoted = poll ? hasVoted(poll.id) : false

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Spinner className="h-8 w-8" />
			</div>
		)
	}

	if (!poll) {
		return (
			<div className="container mx-auto py-20 text-center">
				<h1 className="text-2xl font-bold">Poll not found</h1>
			</div>
		)
	}

	const totalVotes = results
		? Object.values(results).reduce((sum, count) => sum + count, 0)
		: 0

	const sortedOptions = poll.options
		? [...poll.options].sort((a, b) => {
				const aVotes = results?.[a.id] || 0
				const bVotes = results?.[b.id] || 0
				return bVotes - aVotes
			})
		: []

	const handleVote = async () => {
		if (selectedOptions.length === 0) {
			toast.error('Please select at least one option')
			return
		}

		try {
			await vote.mutateAsync({
				pollId: poll.id,
				optionIds: selectedOptions,
			})
			toast.success('Vote submitted!')
			setSelectedOptions([])
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
		<div className="container mx-auto max-w-4xl py-10">
			<Card className="glass-strong">
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="space-y-2">
							<CardTitle className="text-2xl">{poll.title}</CardTitle>
							{poll.description && (
								<p className="text-muted-foreground">{poll.description}</p>
							)}
							<div className="flex gap-2">
								{isClosed && <Badge variant="secondary">Closed</Badge>}
								{poll.visibility === 'unlisted' && (
									<Badge variant="outline">Unlisted</Badge>
								)}
								{poll.visibility === 'private' && <Badge variant="outline">Private</Badge>}
							</div>
						</div>
						<Button variant="ghost" size="icon" onClick={() => setShowShareModal(true)}>
							<Share2 className="h-5 w-5" />
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Voting Interface */}
					{!alreadyVoted && !isClosed && (
						<div className="space-y-4">
							{poll.type === 'single' ? (
								<RadioGroup
									value={selectedOptions[0]}
									onValueChange={(value) => setSelectedOptions([value])}
								>
									{poll.options?.map((option) => (
										<div
											key={option.id}
											className="glass flex items-center space-x-3 rounded-lg p-4 transition-colors hover:bg-accent/20"
										>
											<RadioGroupItem value={option.id} id={option.id} />
											<Label htmlFor={option.id} className="flex-1 cursor-pointer">
												{option.label}
											</Label>
										</div>
									))}
								</RadioGroup>
							) : (
								<div className="space-y-2">
									{poll.options?.map((option) => (
										<div
											key={option.id}
											className="glass flex items-center space-x-3 rounded-lg p-4 transition-colors hover:bg-accent/20"
										>
											<Checkbox
												id={option.id}
												checked={selectedOptions.includes(option.id)}
												onCheckedChange={() => handleOptionToggle(option.id)}
											/>
											<Label htmlFor={option.id} className="flex-1 cursor-pointer">
												{option.label}
											</Label>
										</div>
									))}
								</div>
							)}
							<Button
								onClick={handleVote}
								disabled={selectedOptions.length === 0 || vote.isPending}
								size="lg"
								className="w-full"
							>
								{vote.isPending ? 'Submitting...' : 'Submit Vote'}
							</Button>
						</div>
					)}

					{/* Already Voted Message */}
					{alreadyVoted && (
						<div className="glass flex items-center gap-3 rounded-lg border-primary/20 bg-primary/10 p-4">
							<CheckCircle2 className="h-5 w-5 text-primary" />
							<p className="text-sm font-medium">You've already voted on this poll</p>
						</div>
					)}

					{/* Results */}
					{canShowResults && (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold">Results</h3>
								<p className="text-sm text-muted-foreground">
									{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
								</p>
							</div>
							<AnimatePresence mode="popLayout">
								{sortedOptions.map((option, index) => {
									const votes = results?.[option.id] || 0
									const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0
									const isLeading = index === 0 && votes > 0

									return (
										<motion.div
											key={option.id}
											layout
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											transition={{ duration: 0.3 }}
											className="space-y-2"
										>
											<div className="flex items-center justify-between text-sm">
												<span className={isLeading ? 'font-semibold' : ''}>
													{option.label}
												</span>
												<span className="text-muted-foreground">
													{votes} ({percentage.toFixed(1)}%)
												</span>
											</div>
											<div className="relative h-8 overflow-hidden rounded-lg bg-muted">
												<motion.div
													layout
													initial={{ width: 0 }}
													animate={{ width: `${percentage}%` }}
													transition={{ type: 'spring', stiffness: 100, damping: 20 }}
													className={`h-full ${
														isLeading
															? 'gradient-purple-blue'
															: 'bg-primary/30'
													}`}
												/>
											</div>
										</motion.div>
									)
								})}
							</AnimatePresence>
						</div>
					)}
				</CardContent>
			</Card>

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
