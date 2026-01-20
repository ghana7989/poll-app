import { useParams, useSearchParams } from 'react-router'
import { usePoll } from '@/hooks/use-poll'
import { usePollResults } from '@/hooks/use-poll-results'
import { useVote, hasVoted } from '@/hooks/use-vote'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { CheckCircle2 } from 'lucide-react'
import { getConfig } from '@/utils/config'

export function EmbedPage() {
	const { slug } = useParams()
	const [searchParams] = useSearchParams()
	const theme = searchParams.get('theme') || 'dark'
	const { data: poll, isLoading } = usePoll(slug)
	const { data: results } = usePollResults(poll?._id)
	const vote = useVote()
	const [selectedOptions, setSelectedOptions] = useState<string[]>([])
	const config = getConfig()

	const alreadyVoted = poll ? hasVoted(poll._id) : false

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner className="h-8 w-8" />
			</div>
		)
	}

	if (!poll) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<p>Poll not found</p>
			</div>
		)
	}

	const totalVotes = results
		? Object.values(results).reduce((sum, count) => sum + count, 0)
		: 0

	const sortedOptions = poll.options
		? [...poll.options].sort((a, b) => {
				const aVotes = results?.[a._id] || 0
				const bVotes = results?.[b._id] || 0
				return bVotes - aVotes
			})
		: []

	const handleVote = async () => {
		if (selectedOptions.length === 0) return

		try {
			await vote.mutateAsync({
				pollId: poll._id,
				optionIds: selectedOptions as any,
			})
			setSelectedOptions([])
		} catch (error) {
			console.error('Vote failed:', error)
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

	const canShowResults = poll.showResultsBeforeVote || alreadyVoted

	return (
		<div
			className={`min-h-screen p-4 ${theme === 'dark' ? 'dark bg-background text-foreground' : 'bg-white text-black'}`}
		>
			<div className="mx-auto max-w-2xl space-y-4">
				<div>
					<h1 className="text-xl font-bold">{poll.title}</h1>
					{poll.description && (
						<p className="text-sm text-muted-foreground">{poll.description}</p>
					)}
				</div>

				{/* Voting Interface */}
				{!alreadyVoted && poll.status === 'active' && (
					<div className="space-y-3">
						{poll.type === 'single' ? (
							<RadioGroup
								value={selectedOptions[0]}
								onValueChange={(value) => setSelectedOptions([value])}
							>
								{poll.options?.map((option) => (
									<div
										key={option._id}
										className="flex items-center space-x-3 rounded-lg border p-3"
									>
										<RadioGroupItem value={option._id} id={option._id} />
										<Label htmlFor={option._id} className="flex-1 cursor-pointer">
											{option.label}
										</Label>
									</div>
								))}
							</RadioGroup>
						) : (
							<div className="space-y-2">
								{poll.options?.map((option) => (
									<div
										key={option._id}
										className="flex items-center space-x-3 rounded-lg border p-3"
									>
										<Checkbox
											id={option._id}
											checked={selectedOptions.includes(option._id)}
											onCheckedChange={() => handleOptionToggle(option._id)}
										/>
										<Label htmlFor={option._id} className="flex-1 cursor-pointer">
											{option.label}
										</Label>
									</div>
								))}
							</div>
						)}
						<Button
							onClick={handleVote}
							disabled={selectedOptions.length === 0 || vote.isPending}
							className="w-full"
						>
							{vote.isPending ? 'Submitting...' : 'Submit Vote'}
						</Button>
					</div>
				)}

				{/* Already Voted */}
				{alreadyVoted && (
					<div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 p-3">
						<CheckCircle2 className="h-4 w-4 text-primary" />
						<p className="text-sm">You've already voted</p>
					</div>
				)}

				{/* Results */}
				{canShowResults && (
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold">Results</h3>
							<p className="text-sm text-muted-foreground">{totalVotes} votes</p>
						</div>
						<AnimatePresence mode="popLayout">
							{sortedOptions.map((option, index) => {
								const votes = results?.[option._id] || 0
								const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0
								const isLeading = index === 0 && votes > 0

								return (
									<motion.div
										key={option._id}
										layout
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="space-y-1"
									>
										<div className="flex items-center justify-between text-sm">
											<span>{option.label}</span>
											<span className="text-muted-foreground">
												{votes} ({percentage.toFixed(1)}%)
											</span>
										</div>
										<div className="relative h-6 overflow-hidden rounded bg-muted">
											<motion.div
												layout
												initial={{ width: 0 }}
												animate={{ width: `${percentage}%` }}
												transition={{ type: 'spring', stiffness: 100 }}
												className={`h-full ${
													isLeading ? 'gradient-purple-blue' : 'bg-primary/30'
												}`}
											/>
										</div>
									</motion.div>
								)
							})}
						</AnimatePresence>
					</div>
				)}

				{/* Footer */}
				<div className="border-t pt-3 text-center">
					<a
						href={config.appUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-xs text-muted-foreground hover:underline"
					>
						Powered by {config.appName}
					</a>
				</div>
			</div>
		</div>
	)
}
