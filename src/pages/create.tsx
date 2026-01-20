import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, X, GripVertical } from 'lucide-react'
import { useCreatePoll } from '@/hooks/use-create-poll'
import { type CreatePollInput } from '@/utils/validators'
import { POLL_LIMITS, POLL_VISIBILITY, POLL_TYPE } from '@/utils/constants'

// Form schema without options (options are managed separately via useState)
const createPollFormSchema = z.object({
	title: z.string().min(1, 'Title is required').max(200),
	description: z.string().max(1000).optional(),
	type: z.enum([POLL_TYPE.SINGLE, POLL_TYPE.MULTIPLE]),
	visibility: z.enum([POLL_VISIBILITY.PUBLIC, POLL_VISIBILITY.UNLISTED, POLL_VISIBILITY.PRIVATE]),
	maxSelections: z.number().min(1).optional(),
	showResultsBeforeVote: z.boolean(),
	requireAuthToVote: z.boolean(),
	allowEmbed: z.boolean(),
	allowComments: z.boolean(),
	closesAt: z.date().optional(),
})

type CreatePollFormData = z.infer<typeof createPollFormSchema>
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export function CreatePage() {
	const createPoll = useCreatePoll()
	const [options, setOptions] = useState(['', ''])
	const [showAdvanced, setShowAdvanced] = useState(false)

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<CreatePollFormData>({
		resolver: zodResolver(createPollFormSchema),
		defaultValues: {
			type: POLL_TYPE.SINGLE,
			visibility: POLL_VISIBILITY.PUBLIC,
			showResultsBeforeVote: true,
			requireAuthToVote: false,
			allowEmbed: true,
			allowComments: true,
		},
	})

	const pollType = watch('type')

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

	const onSubmit = async (data: CreatePollFormData) => {
		try {
			const validOptions = options.filter((opt) => opt.trim())
			if (validOptions.length < POLL_LIMITS.MIN_OPTIONS) {
				toast.error(`At least ${POLL_LIMITS.MIN_OPTIONS} options required`)
				return
			}

			await createPoll.mutateAsync({
				...data,
				options: validOptions.map((label) => ({ label })),
			} as CreatePollInput)
			toast.success('Poll created successfully!')
		} catch (error) {
			toast.error('Failed to create poll')
		}
	}

	return (
		<div className="container mx-auto max-w-3xl px-4 py-10">
			<Card className="glass-strong">
				<CardHeader>
					<CardTitle>Create a Poll</CardTitle>
					<CardDescription>
						Create a new poll and share it with the world
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Title */}
						<div className="space-y-2">
							<Label htmlFor="title">Question *</Label>
							<Input
								id="title"
								placeholder="What's your question?"
								{...register('title')}
								className="glass"
							/>
							{errors.title && (
								<p className="text-sm text-destructive">{errors.title.message}</p>
							)}
						</div>

						{/* Description */}
						<div className="space-y-2">
							<Label htmlFor="description">Description (optional)</Label>
							<Textarea
								id="description"
								placeholder="Add more context..."
								{...register('description')}
								className="glass"
							/>
							{errors.description && (
								<p className="text-sm text-destructive">{errors.description.message}</p>
							)}
						</div>

						{/* Options */}
						<div className="space-y-2">
							<Label>Options *</Label>
							<div className="space-y-2">
								{options.map((option, index) => (
									<div key={index} className="flex gap-2">
										<GripVertical className="mt-2 h-5 w-5 text-muted-foreground" />
										<Input
											placeholder={`Option ${index + 1}`}
											value={option}
											onChange={(e) => updateOption(index, e.target.value)}
											className="glass"
										/>
										{options.length > POLL_LIMITS.MIN_OPTIONS && (
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => removeOption(index)}
											>
												<X className="h-4 w-4" />
											</Button>
										)}
									</div>
								))}
							</div>
							{options.length < POLL_LIMITS.MAX_OPTIONS && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={addOption}
									className="glass"
								>
									<Plus className="mr-2 h-4 w-4" />
									Add Option
								</Button>
							)}
						</div>

						{/* Poll Type */}
						<div className="space-y-2">
							<Label>Poll Type</Label>
							<RadioGroup
								defaultValue={POLL_TYPE.SINGLE}
								onValueChange={(value) => setValue('type', value as any)}
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value={POLL_TYPE.SINGLE} id="single" />
									<Label htmlFor="single">Single Choice</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value={POLL_TYPE.MULTIPLE} id="multiple" />
									<Label htmlFor="multiple">Multiple Choice</Label>
								</div>
							</RadioGroup>
						</div>

						{/* Max Selections (if multiple) */}
						{pollType === POLL_TYPE.MULTIPLE && (
							<div className="space-y-2">
								<Label htmlFor="maxSelections">Max Selections</Label>
								<Select
									onValueChange={(value) => setValue('maxSelections', parseInt(value))}
								>
									<SelectTrigger className="glass">
										<SelectValue placeholder="Select max" />
									</SelectTrigger>
									<SelectContent>
										{Array.from({ length: options.length - 1 }, (_, i) => i + 2).map(
											(num) => (
												<SelectItem key={num} value={num.toString()}>
													{num}
												</SelectItem>
											)
										)}
									</SelectContent>
								</Select>
							</div>
						)}

						{/* Advanced Settings */}
						<Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
							<CollapsibleTrigger asChild>
								<Button type="button" variant="ghost" className="w-full">
									{showAdvanced ? 'Hide' : 'Show'} Advanced Settings
								</Button>
							</CollapsibleTrigger>
							<CollapsibleContent className="space-y-4 pt-4">
								{/* Visibility */}
								<div className="space-y-2">
									<Label>Visibility</Label>
									<RadioGroup
										defaultValue={POLL_VISIBILITY.PUBLIC}
										onValueChange={(value) => setValue('visibility', value as any)}
									>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value={POLL_VISIBILITY.PUBLIC} id="public" />
											<Label htmlFor="public">Public</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value={POLL_VISIBILITY.UNLISTED} id="unlisted" />
											<Label htmlFor="unlisted">Unlisted</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value={POLL_VISIBILITY.PRIVATE} id="private" />
											<Label htmlFor="private">Private</Label>
										</div>
									</RadioGroup>
								</div>

								{/* Switches */}
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<Label htmlFor="showResults">Show results before voting</Label>
										<Switch
											id="showResults"
											defaultChecked
											onCheckedChange={(checked) =>
												setValue('showResultsBeforeVote', checked)
											}
										/>
									</div>
									<div className="flex items-center justify-between">
										<Label htmlFor="requireAuth">Require sign-in to vote</Label>
										<Switch
											id="requireAuth"
											onCheckedChange={(checked) =>
												setValue('requireAuthToVote', checked)
											}
										/>
									</div>
									<div className="flex items-center justify-between">
										<Label htmlFor="allowEmbed">Allow embedding</Label>
										<Switch
											id="allowEmbed"
											defaultChecked
											onCheckedChange={(checked) => setValue('allowEmbed', checked)}
										/>
									</div>
									<div className="flex items-center justify-between">
										<Label htmlFor="allowComments">Allow comments</Label>
										<Switch
											id="allowComments"
											defaultChecked
											onCheckedChange={(checked) => setValue('allowComments', checked)}
										/>
									</div>
								</div>
							</CollapsibleContent>
						</Collapsible>

						{/* Submit */}
						<Button
							type="submit"
							className="w-full"
							disabled={createPoll.isPending}
							size="lg"
						>
							{createPoll.isPending ? 'Creating...' : 'Create Poll'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
