import { useState } from 'react'
import { Link } from 'react-router'
import { Plus, BarChart3, Users, TrendingUp, Eye, Share2, Trash2 } from 'lucide-react'
import { usePolls } from '@/hooks/use-polls'
import { supabase } from '@/utils/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/ui/spinner'
import { ShareModal } from '@/components/poll/share-modal'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

export function DashboardPage() {
	const { data: polls, isLoading } = usePolls()
	const [pollToDelete, setPollToDelete] = useState<string | null>(null)
	const [pollToShare, setPollToShare] = useState<any>(null)
	const queryClient = useQueryClient()

	const totalPolls = polls?.length || 0
	const totalVotes = polls?.reduce((sum, poll) => sum + poll.voteCount, 0) || 0
	const activePolls = polls?.filter((poll) => poll.status === 'active').length || 0

	const handleDelete = async () => {
		if (!pollToDelete) return

		try {
			const { error } = await supabase.from('polls').delete().eq('id', pollToDelete)

			if (error) throw error

			toast.success('Poll deleted successfully')
			queryClient.invalidateQueries({ queryKey: ['polls'] })
			setPollToDelete(null)
		} catch (error) {
			toast.error('Failed to delete poll')
		}
	}

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Spinner className="h-8 w-8" />
			</div>
		)
	}

	return (
		<div className="container mx-auto py-10">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<p className="text-muted-foreground">Manage your polls</p>
				</div>
				<Button asChild size="lg">
					<Link to="/create">
						<Plus className="mr-2 h-4 w-4" />
						Create Poll
					</Link>
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="mb-8 grid gap-4 md:grid-cols-3">
				<Card className="glass">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Polls</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalPolls}</div>
					</CardContent>
				</Card>
				<Card className="glass">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Votes</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalVotes}</div>
					</CardContent>
				</Card>
				<Card className="glass">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Polls</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{activePolls}</div>
					</CardContent>
				</Card>
			</div>

			{/* Polls Table */}
			{polls && polls.length > 0 ? (
				<Card className="glass-strong">
					<CardHeader>
						<CardTitle>Your Polls</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Title</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Votes</TableHead>
									<TableHead className="text-right">Created</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{polls.map((poll) => (
									<TableRow key={poll.id}>
										<TableCell className="font-medium">{poll.title}</TableCell>
										<TableCell>
											<Badge
												variant={poll.status === 'active' ? 'default' : 'secondary'}
											>
												{poll.status}
											</Badge>
										</TableCell>
										<TableCell className="text-right">{poll.voteCount}</TableCell>
										<TableCell className="text-right">
											{poll.created_at
												? format(new Date(poll.created_at), 'MMM d, yyyy')
												: '-'}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button variant="ghost" size="icon" asChild>
													<Link to={`/poll/${poll.slug}`}>
														<Eye className="h-4 w-4" />
													</Link>
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => setPollToShare(poll)}
												>
													<Share2 className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => setPollToDelete(poll.id)}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			) : (
				<Card className="glass-strong">
					<CardContent className="flex flex-col items-center justify-center py-16">
						<BarChart3 className="mb-4 h-16 w-16 text-muted-foreground" />
						<h3 className="mb-2 text-xl font-semibold">No polls yet</h3>
						<p className="mb-6 text-muted-foreground">
							Create your first poll to get started
						</p>
						<Button asChild size="lg">
							<Link to="/create">
								<Plus className="mr-2 h-4 w-4" />
								Create Poll
							</Link>
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Delete Dialog */}
			<AlertDialog open={!!pollToDelete} onOpenChange={() => setPollToDelete(null)}>
				<AlertDialogContent className="glass-strong">
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Poll?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the poll and all
							its votes.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Share Modal */}
			{pollToShare && (
				<ShareModal
					poll={pollToShare}
					isOpen={!!pollToShare}
					onClose={() => setPollToShare(null)}
				/>
			)}
		</div>
	)
}
