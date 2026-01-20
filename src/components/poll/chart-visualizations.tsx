import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pie, PieChart } from 'recharts'
import { PieChart as PieChartIcon, List } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
	type ChartConfig,
} from '@/components/ui/chart'

interface PollOption {
	_id: string
	label: string
	position: number
}

interface ChartVisualizationsProps {
	options: PollOption[]
	results: Record<string, number>
	totalVotes: number
}

export function ChartVisualizations({
	options,
	results,
	totalVotes,
}: ChartVisualizationsProps) {
	const { chartData, chartConfig, sortedData } = useMemo(() => {
		const colors = [
			'var(--chart-1)',
			'var(--chart-2)',
			'var(--chart-3)',
			'var(--chart-4)',
			'var(--chart-5)',
		]

		const data = options.map((option, index) => {
			const votes = results[option._id] || 0
			const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0
			return {
				name: option.label,
				votes,
				percentage,
				fill: colors[index % colors.length],
			}
		})

		// Create chart config for shadcn/ui
		const config: ChartConfig = {
			votes: {
				label: 'Votes',
				color: 'hsl(var(--chart-1))',
			},
		}

		options.forEach((option, index) => {
			config[option.label] = {
				label: option.label,
				color: colors[index % colors.length],
			}
		})

		const sorted = [...data].sort((a, b) => b.votes - a.votes)

		return { chartData: data, chartConfig: config, sortedData: sorted }
	}, [options, results, totalVotes])

	return (
		<Card className='glass-strong'>
			<CardContent className='p-4'>
				<Tabs defaultValue='list' className='w-full'>
					<TabsList className='grid w-full grid-cols-2 mb-4 h-9'>
						<TabsTrigger
							value='list'
							className='flex items-center gap-1.5 text-xs'
						>
							<List className='h-3.5 w-3.5' />
							<span className='hidden sm:inline'>List</span>
						</TabsTrigger>
						<TabsTrigger
							value='pie'
							className='flex items-center gap-1.5 text-xs'
						>
							<PieChartIcon className='h-3.5 w-3.5' />
							<span className='hidden sm:inline'>Pie</span>
						</TabsTrigger>
					</TabsList>

					{/* Pie Chart */}
					<TabsContent value='pie' className='mt-0'>
						<motion.div
							key='pie-chart'
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.2 }}
						>
							<ChartContainer
								config={chartConfig}
								className='mx-auto aspect-square max-h-[250px]'
							>
								<PieChart>
									<ChartTooltip content={<ChartTooltipContent hideLabel />} />
									<Pie data={chartData} dataKey='votes' nameKey='name' />
									<ChartLegend
										content={<ChartLegendContent nameKey='name' />}
										className='-translate-y-2 flex-wrap gap-1.5 *:basis-1/4 *:justify-center text-xs'
									/>
								</PieChart>
							</ChartContainer>
						</motion.div>
					</TabsContent>

					{/* List View (Horizontal Bars) */}
					<TabsContent value='list' className='mt-0'>
						<motion.div
							key='list-view'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.2 }}
							className='space-y-2.5'
						>
							<AnimatePresence mode='popLayout'>
								{sortedData.map((option, index) => {
									const isLeading = index === 0 && option.votes > 0

									return (
										<motion.div
											key={option.name}
											layout
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.2, delay: index * 0.03 }}
											className='space-y-1'
										>
											<div className='flex items-center justify-between text-xs'>
												<span className={isLeading ? 'font-semibold' : ''}>
													{option.name}
												</span>
												<span className='text-muted-foreground'>
													{option.votes} ({option.percentage.toFixed(0)}%)
												</span>
											</div>
											<div className='relative h-6 overflow-hidden rounded-md bg-muted'>
												<motion.div
													layout
													initial={{ width: 0 }}
													animate={{ width: `${option.percentage}%` }}
													transition={{
														type: 'spring',
														stiffness: 100,
														damping: 20,
														delay: index * 0.03,
													}}
													className={`h-full ${
														isLeading ? 'gradient-purple-blue' : 'bg-primary/30'
													}`}
													style={{
														minWidth: option.votes > 0 ? '2%' : '0%',
													}}
												/>
											</div>
										</motion.div>
									)
								})}
							</AnimatePresence>
						</motion.div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}
