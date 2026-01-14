import { Link } from 'react-router'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart3, Zap, Shield, Globe } from 'lucide-react'

export function HomePage() {
	const { user } = useAuth()

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="container mx-auto px-4 py-20 text-center">
				<h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
					Realtime Polls
					<br />
					<span className="gradient-purple-blue bg-clip-text text-transparent">
						Made Simple
					</span>
				</h1>
				<p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
					Create polls, share via link, and watch votes stream in live. Clean UI, minimal
					friction, privacy-respecting.
				</p>
				<div className="mt-10 flex items-center justify-center gap-4">
					{user ? (
						<Button size="lg" asChild>
							<Link to="/create">
								Create Poll <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					) : (
						<Button size="lg" asChild>
							<Link to="/login">Get Started</Link>
						</Button>
					)}
				</div>
			</section>

			{/* Features Section */}
			<section className="container mx-auto px-4 py-20">
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
					<FeatureCard
						icon={<Zap className="h-6 w-6" />}
						title="Instant Updates"
						description="Watch votes stream in realtime with WebSocket connections"
					/>
					<FeatureCard
						icon={<BarChart3 className="h-6 w-6" />}
						title="Visual Insights"
						description="Beautiful animated charts that update as votes come in"
					/>
					<FeatureCard
						icon={<Shield className="h-6 w-6" />}
						title="Privacy Respecting"
						description="Browser fingerprinting prevents duplicate votes without tracking"
					/>
					<FeatureCard
						icon={<Globe className="h-6 w-6" />}
						title="Global Scale"
						description="Powered by Cloudflare and Supabase for worldwide performance"
					/>
				</div>
			</section>

			{/* Use Cases */}
			<section className="container mx-auto px-4 py-20">
				<h2 className="mb-12 text-center text-3xl font-bold">Perfect For</h2>
				<div className="flex flex-wrap justify-center gap-3">
					{['Live Streams', 'Teams', 'Events', 'Education', 'Product Feedback'].map(
						(useCase) => (
							<div
								key={useCase}
								className="glass rounded-full px-6 py-3 text-sm font-medium"
							>
								{useCase}
							</div>
						)
					)}
				</div>
			</section>
		</div>
	)
}

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode
	title: string
	description: string
}) {
	return (
		<div className="glass rounded-lg p-6">
			<div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
				{icon}
			</div>
			<h3 className="mb-2 text-xl font-semibold">{title}</h3>
			<p className="text-sm text-muted-foreground">{description}</p>
		</div>
	)
}
