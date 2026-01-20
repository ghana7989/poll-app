import { useState } from 'react'
import { Plus, X, Sparkles, Check, Copy } from 'lucide-react'
import { useCreatePoll } from '@/hooks/use-create-poll'
import { POLL_LIMITS, POLL_VISIBILITY, POLL_TYPE } from '@/utils/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export function QuickCreateForm() {
	const createPoll = useCreatePoll()
	const [question, setQuestion] = useState('')
	const [options, setOptions] = useState(['', ''])
	const [createdPollUrl, setCreatedPollUrl] = useState<string | null>(null)

	const addOption = () => {
		if (options.length < POLL_LIMITS.MAX_OPTIONS) {
			setOptions([...options, ''])
		}
	}

	const removeOption = (index: number) => {
		if (options.length > POLL_LIMITS.MIN_OPTIONS) {
			setOptions(options.filter((_, i) => i !== index))
		}
	}

	const updateOption = (index: number, value: string) => {
		const newOptions = [...options]
		newOptions[index] = value
		setOptions(newOptions)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!question.trim()) {
			toast.error('Please enter a question')
			return
		}

		const validOptions = options.filter((opt) => opt.trim())
		if (validOptions.length < POLL_LIMITS.MIN_OPTIONS) {
			toast.error(`At least ${POLL_LIMITS.MIN_OPTIONS} options required`)
			return
		}

		try {
			const poll = await createPoll.mutateAsync({
				title: question,
				description: '',
				type: POLL_TYPE.SINGLE,
				visibility: POLL_VISIBILITY.PUBLIC,
				showResultsBeforeVote: true,
				requireAuthToVote: false,
				allowEmbed: true,
				allowComments: true,
				options: validOptions.map((label) => ({ label })),
			})

			const pollUrl = `${window.location.origin}/poll/${poll.slug}`
			setCreatedPollUrl(pollUrl)
			toast.success('Poll created successfully!')
		} catch (error) {
			toast.error('Failed to create poll')
			console.error(error)
		}
	}

	const copyToClipboard = () => {
		if (createdPollUrl) {
			navigator.clipboard.writeText(createdPollUrl)
			toast.success('Link copied to clipboard!')
		}
	}

	const createAnother = () => {
		setQuestion('')
		setOptions(['', ''])
		setCreatedPollUrl(null)
	}

	const visitPoll = () => {
		if (createdPollUrl) {
			window.location.href = createdPollUrl
		}
	}

	if (createdPollUrl) {
		return (
			<div className="glass-strong rounded-2xl p-8 animate-scale-in">
				<div className="text-center space-y-6">
					<div className="mx-auto w-16 h-16 rounded-full bg-gradient-purple-blue flex items-center justify-center animate-pulse-glow">
						<Check className="h-8 w-8 text-white" />
					</div>
					<div className="space-y-2">
						<h3 className="text-2xl font-bold gradient-purple-blue bg-clip-text text-transparent">
							Poll Created!
						</h3>
						<p className="text-muted-foreground">
							Share this link with your audience
						</p>
					</div>
					<div className="flex gap-2">
						<Input
							value={createdPollUrl}
							readOnly
							className="glass font-mono text-sm"
						/>
						<Button
							variant="outline"
							size="icon"
							onClick={copyToClipboard}
							className="glass-strong shrink-0"
						>
							<Copy className="h-4 w-4" />
						</Button>
					</div>
					<div className="flex gap-3">
						<Button
							onClick={visitPoll}
							className="flex-1 bg-gradient-purple-blue text-white hover:opacity-90 transition-all"
							size="lg"
						>
							View Poll
						</Button>
						<Button
							onClick={createAnother}
							variant="outline"
							className="flex-1 glass-strong"
							size="lg"
						>
							Create Another
						</Button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="glass-strong rounded-2xl p-8 space-y-6 relative overflow-hidden group animate-fade-in"
		>
			{/* Gradient glow effect on hover */}
			<div className="absolute inset-0 bg-gradient-purple-blue opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl" />

			<div className="relative space-y-6">
				<div className="space-y-2">
					<label className="text-sm font-medium flex items-center gap-2">
						<Sparkles className="h-4 w-4 text-primary" />
						Your Question
					</label>
					<Textarea
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
						placeholder="What would you like to ask?"
						className="glass resize-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[80px]"
						maxLength={200}
					/>
					<p className="text-xs text-muted-foreground">
						{question.length}/200 characters
					</p>
				</div>

				<div className="space-y-3">
					<label className="text-sm font-medium">Options</label>
					{options.map((option, index) => (
						<div
							key={index}
							className="flex gap-2 animate-scale-in"
							style={{ animationDelay: `${index * 0.05}s` }}
						>
							<div className="relative flex-1">
								<Input
									value={option}
									onChange={(e) => updateOption(index, e.target.value)}
									placeholder={`Option ${index + 1}`}
									className="glass focus:ring-2 focus:ring-primary/50 transition-all pl-10"
									maxLength={100}
								/>
								<div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
									{index + 1}
								</div>
							</div>
							{options.length > POLL_LIMITS.MIN_OPTIONS && (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => removeOption(index)}
									className="glass-strong hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
								>
									<X className="h-4 w-4" />
								</Button>
							)}
						</div>
					))}

					{options.length < POLL_LIMITS.MAX_OPTIONS && (
						<Button
							type="button"
							variant="outline"
							onClick={addOption}
							className="w-full glass-strong hover:bg-primary/5 transition-colors"
						>
							<Plus className="mr-2 h-4 w-4" />
							Add Option
						</Button>
					)}
				</div>

				<Button
					type="submit"
					disabled={createPoll.isPending}
					className="w-full bg-gradient-purple-blue text-white hover:opacity-90 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
					size="lg"
				>
					{createPoll.isPending ? (
						<>
							<div className="mr-2 h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							Creating...
						</>
					) : (
						<>
							<Sparkles className="mr-2 h-4 w-4" />
							Create Poll
						</>
					)}
				</Button>

				<p className="text-xs text-center text-muted-foreground">
					No sign-up required • Share instantly • Free forever
				</p>
			</div>
		</form>
	)
}
