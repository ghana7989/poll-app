import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Clock, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface PollStatisticsProps {
	totalVotes: number
	leadingOption: { label: string; votes: number; percentage: number } | null
	closesAt: string | null
	status: 'active' | 'closed'
	pollType: 'single' | 'multiple'
	createdAt: string
	isPulsing?: boolean
}

export function PollStatistics({
	totalVotes,
	leadingOption,
	closesAt,
	status,
	pollType,
	createdAt,
	isPulsing = false,
}: PollStatisticsProps) {
	const timeInfo = useMemo(() => {
		if (status === 'closed') {
			return { text: 'Closed', type: 'closed' as const }
		}
		if (closesAt) {
			const distance = formatDistanceToNow(new Date(closesAt), {
				addSuffix: true,
			})
			return { text: `Closes ${distance}`, type: 'closing' as const }
		}
		const age = formatDistanceToNow(new Date(createdAt), { addSuffix: true })
		return { text: `Created ${age}`, type: 'active' as const }
	}, [status, closesAt, createdAt])

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	}

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring' as const,
				stiffness: 100,
				damping: 15,
			},
		},
	}

	return (
		<Card className='glass-strong'>
			<CardHeader className='pb-2 pt-3 px-4'>
				<CardTitle className='text-sm font-medium'>Poll Statistics</CardTitle>
			</CardHeader>
			<CardContent className='px-4 pb-4'>
				<motion.div
					variants={containerVariants}
					initial='hidden'
					animate='visible'
				>
					<div className='grid grid-cols-2 gap-3'>
						{/* Total Votes */}
						<motion.div variants={itemVariants}>
							<Card
								className={`glass ${isPulsing ? 'animate-pulse-glow' : ''}`}
							>
								<CardContent className='p-3'>
									<div className='flex items-center justify-between'>
										<div>
											<p className='text-xs text-muted-foreground'>
												Total Votes
											</p>
											<motion.p
												key={totalVotes}
												initial={{ scale: 1.1, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												className='text-xl font-bold gradient-purple-blue bg-clip-text text-transparent'
											>
												{totalVotes.toLocaleString()}
											</motion.p>
										</div>
										<div className='p-2 rounded-md bg-primary/10'>
											<Users className='h-4 w-4 text-primary' />
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Leading Option */}
						<motion.div variants={itemVariants}>
							<Card className='glass'>
								<CardContent className='p-3'>
									<div className='flex items-center justify-between'>
										<div className='flex-1 min-w-0'>
											<p className='text-xs text-muted-foreground'>
												Leading
											</p>
											{leadingOption ? (
												<>
													<p
														className='text-sm font-semibold truncate'
														title={leadingOption.label}
													>
														{leadingOption.label}
													</p>
													<p className='text-xs text-muted-foreground'>
														{leadingOption.percentage.toFixed(0)}%
													</p>
												</>
											) : (
												<p className='text-sm text-muted-foreground'>
													No votes
												</p>
											)}
										</div>
										<div className='p-2 rounded-md bg-secondary/10'>
											<TrendingUp className='h-4 w-4 text-secondary' />
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Status */}
						<motion.div variants={itemVariants}>
							<Card className='glass'>
								<CardContent className='p-3'>
									<div className='flex items-center justify-between'>
										<div>
											<p className='text-xs text-muted-foreground'>
												Status
											</p>
											{timeInfo.type === 'closed' ? (
												<Badge variant='secondary' className='text-xs mt-1'>
													Closed
												</Badge>
											) : timeInfo.type === 'closing' ? (
												<p className='text-sm font-medium'>{timeInfo.text}</p>
											) : (
												<Badge variant='outline' className='text-xs mt-1'>
													Active
												</Badge>
											)}
										</div>
										<div className='p-2 rounded-md bg-accent/10'>
											<Clock className='h-4 w-4 text-accent-foreground' />
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Poll Type */}
						<motion.div variants={itemVariants}>
							<Card className='glass'>
								<CardContent className='p-3'>
									<div className='flex items-center justify-between'>
										<div>
											<p className='text-xs text-muted-foreground'>
												Type
											</p>
											<p className='text-sm font-medium'>
												{pollType === 'single' ? 'Single' : 'Multiple'}
											</p>
										</div>
										<div className='p-2 rounded-md bg-primary/10'>
											<CheckCircle2 className='h-4 w-4 text-primary' />
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</motion.div>
			</CardContent>
		</Card>
	)
}
