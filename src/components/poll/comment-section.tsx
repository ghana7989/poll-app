import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Trash2, Send } from 'lucide-react'
import { useComments, useAddComment, useDeleteComment } from '@/hooks/use-comments'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

interface CommentSectionProps {
	pollId: string
	pollCreatorId: string | null
	allowComments: boolean
}

export function CommentSection({
	pollId,
	pollCreatorId,
	allowComments,
}: CommentSectionProps) {
	const { data: comments, isLoading } = useComments(pollId)
	const addComment = useAddComment()
	const deleteComment = useDeleteComment()
	const { user } = useAuth()
	const [content, setContent] = useState('')
	const scrollRef = useRef<HTMLDivElement>(null)

	// Auto-scroll to bottom when new comments arrive
	useEffect(() => {
		if (scrollRef.current && comments) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight
		}
	}, [comments])

	const handleSubmit = async (e?: React.FormEvent) => {
		if (e) e.preventDefault()

		if (!content.trim()) {
			toast.error('Comment cannot be empty')
			return
		}

		if (content.length > 1000) {
			toast.error('Comment is too long (max 1000 characters)')
			return
		}

		try {
			await addComment.mutateAsync({ pollId, content: content.trim() })
			setContent('')
			toast.success('Comment added!')
		} catch (error: any) {
			toast.error(error.message || 'Failed to add comment')
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSubmit()
		}
	}

	const handleDelete = async (commentId: string) => {
		if (!confirm('Delete this comment?')) return

		try {
			await deleteComment.mutateAsync({ commentId })
			toast.success('Comment deleted')
		} catch (error: any) {
			toast.error(error.message || 'Failed to delete comment')
		}
	}

	const canDeleteComment = (comment: any) => {
		return user?.id === comment.commenterId || user?.id === pollCreatorId
	}

	if (!allowComments) return null

	return (
		<Card className='glass-strong'>
			<CardHeader className='border-b border-border/50'>
				<CardTitle className='flex items-center gap-2'>
					<MessageSquare className='h-5 w-5' />
					Discussion
					<Badge variant='outline' className='ml-auto text-xs gap-1.5'>
						<span className='relative flex h-2 w-2'>
							<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
							<span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
						</span>
						Live Chat
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className='p-0'>
				{/* Comments List */}
				<div 
					ref={scrollRef}
					className='min-h-[300px] max-h-[500px] overflow-y-auto p-4 scroll-smooth'
				>
					{isLoading ? (
						<div className='flex justify-center py-16'>
							<Spinner />
						</div>
					) : comments?.length === 0 ? (
						<div className='flex flex-col items-center justify-center py-16 text-center'>
							<div className='rounded-full bg-muted p-4 mb-4'>
								<MessageSquare className='h-8 w-8 text-muted-foreground' />
							</div>
							<p className='text-muted-foreground text-sm'>
								No comments yet. Start the conversation!
							</p>
						</div>
					) : (
						<div className='space-y-4'>
							{comments?.map((comment) => (
								<div key={comment._id} className='group'>
									<div className='flex items-start gap-3'>
										<Avatar className='h-8 w-8 shrink-0'>
											<AvatarImage src={comment.commenter?.image || undefined} />
											<AvatarFallback className='bg-primary/10 text-primary text-xs'>
												{comment.commenter?.name?.[0] || 'A'}
											</AvatarFallback>
										</Avatar>
										<div className='flex-1 min-w-0'>
											<div className='flex items-baseline gap-2'>
												<p className='text-sm font-medium'>
													{comment.commenter?.name || 'Anonymous'}
												</p>
												<p className='text-xs text-muted-foreground'>
													{formatDistanceToNow(comment._creationTime, {
														addSuffix: true,
													})}
												</p>
												{canDeleteComment(comment) && (
													<Button
														variant='ghost'
														size='icon'
														onClick={() => handleDelete(comment._id)}
														disabled={deleteComment.isPending}
														className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-auto'
													>
														<Trash2 className='h-3.5 w-3.5' />
													</Button>
												)}
											</div>
											<p className='text-sm mt-1 whitespace-pre-wrap break-words'>
												{comment.content}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Comment Form */}
				<div className='border-t border-border/50 p-4 bg-muted/20'>
					<form onSubmit={handleSubmit} className='space-y-2'>
						<div className='flex items-end gap-3'>
							<Avatar className='h-8 w-8 shrink-0'>
								<AvatarImage src={user?.user_metadata?.avatar_url} />
								<AvatarFallback className='bg-primary/10 text-primary text-xs'>
									{user?.user_metadata?.full_name?.[0] || 'A'}
								</AvatarFallback>
							</Avatar>
							<div className='flex-1 space-y-2'>
								<Textarea
									value={content}
									onChange={(e) => setContent(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder='Add a comment...'
									className='resize-none min-h-[60px] bg-background'
									maxLength={1000}
								/>
								<div className='flex justify-between items-center'>
									<span className='text-xs text-muted-foreground'>
										{content.length}/1000 • Press Enter to send, Shift+Enter for new line
									</span>
									<Button
										type='submit'
										disabled={!content.trim() || addComment.isPending}
										size='sm'
										className='gap-2'
									>
										{addComment.isPending ? (
											'Sending...'
										) : (
											<>
												Comment
												<Send className='h-3.5 w-3.5' />
											</>
										)}
									</Button>
								</div>
							</div>
						</div>
					</form>
				</div>
			</CardContent>
		</Card>
	)
}
