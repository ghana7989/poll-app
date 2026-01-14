import { motion } from 'framer-motion'
import { Share2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'

interface PollHeaderProps {
	title: string
	description?: string | null
	creator?: {
		id: string
		full_name: string | null
		avatar_url: string | null
	} | null
	createdAt: string
	status: 'active' | 'closed'
	visibility: 'public' | 'unlisted' | 'private'
	pollType: 'single' | 'multiple'
	onShare: () => void
}

export function PollHeader({
	title,
	description,
	creator,
	createdAt,
	status,
	visibility,
	pollType,
	onShare,
}: PollHeaderProps) {
	const getInitials = (name: string | null) => {
		if (!name) return '??'
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}

	return (
		<Card className="glass-strong">
			<CardContent className="p-4">
				<div className="space-y-3">
					{/* Top row: Title with badges and share */}
					<div className="flex items-start justify-between gap-3">
						<div className="flex-1 min-w-0">
							<motion.h1
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
								className="text-xl md:text-2xl font-bold gradient-purple-blue bg-clip-text text-transparent leading-tight"
							>
								{title}
							</motion.h1>
						</div>
						<div className="flex items-center gap-2 shrink-0">
							<div className="flex flex-wrap gap-1.5">
								{status === 'closed' && (
									<Badge variant="secondary" className="text-xs">
										Closed
									</Badge>
								)}
								{visibility === 'unlisted' && (
									<Badge variant="outline" className="text-xs">
										Unlisted
									</Badge>
								)}
								{visibility === 'private' && (
									<Badge variant="outline" className="text-xs">
										Private
									</Badge>
								)}
								<Badge variant="outline" className="text-xs">
									{pollType === 'single' ? 'Single' : 'Multiple'}
								</Badge>
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={onShare}
								className="h-8 w-8"
							>
								<Share2 className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Description */}
					{description && (
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3, delay: 0.1 }}
							className="text-sm text-muted-foreground"
						>
							{description}
						</motion.p>
					)}

					{/* Creator Info and Timestamp */}
					<div className="flex items-center gap-3 pt-2 border-t border-border/50 text-xs text-muted-foreground">
						{creator && (
							<div className="flex items-center gap-2">
								<Avatar className="h-6 w-6">
									<AvatarImage src={creator.avatar_url || undefined} />
									<AvatarFallback className="bg-primary/10 text-primary text-xs">
										{getInitials(creator.full_name)}
									</AvatarFallback>
								</Avatar>
								<span>{creator.full_name || 'Anonymous'}</span>
							</div>
						)}
						<div className="flex items-center gap-1.5 ml-auto">
							<Calendar className="h-3.5 w-3.5" />
							<span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
