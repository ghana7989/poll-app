import { Link } from 'react-router'
import { QuickCreateForm } from '@/components/poll/quick-create-form'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BarChart3, Zap, Shield, Globe, Sparkles, Clock, Users, ArrowRight, Star, MessageSquare, TrendingUp } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRecentPolls } from '@/hooks/use-recent-polls'

export function HomePage() {
	const { user, signInWithGoogle } = useAuth()
	const { data: recentPolls, isLoading: pollsLoading } = useRecentPolls(6)
	const [pollCount, setPollCount] = useState(1234)
	const [voteCount, setVoteCount] = useState(45678)

	// Simulated live counter animation
	useEffect(() => {
		const interval = setInterval(() => {
			setPollCount((prev) => prev + Math.floor(Math.random() * 3))
			setVoteCount((prev) => prev + Math.floor(Math.random() * 10))
		}, 5000)
		return () => clearInterval(interval)
	}, [])

	return (
		<div className="min-h-screen relative">
			{/* Animated background blobs */}
			<div className="blur-blob blur-blob-1 dark:opacity-40" />
			<div className="blur-blob blur-blob-2 dark:opacity-40" />
			<div className="blur-blob blur-blob-3 dark:opacity-40" />

			{/* Hero Section - Two Column Layout */}
			<section className="container mx-auto px-4 py-20 relative">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
					{/* Left Column - Marketing Copy */}
					<div className="space-y-8 animate-slide-in-left">
						<div className="space-y-6">
							<h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-tight">
								Create Beautiful Polls
								<br />
								<span className="gradient-purple-blue bg-clip-text text-transparent">
									in Seconds
								</span>
							</h1>
							<p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
								No sign-up required. Share instantly. Watch votes flow in real-time
								with beautiful visualizations.
							</p>
						</div>

						{/* Feature Pills */}
						<div className="flex flex-wrap gap-3">
							{[
								{ icon: Sparkles, label: 'Instant Creation' },
								{ icon: Zap, label: 'Real-time Updates' },
								{ icon: Shield, label: 'Privacy First' },
								{ icon: Clock, label: 'No Sign-up' },
							].map((feature, index) => (
								<div
									key={feature.label}
									className="glass-strong rounded-full px-5 py-2.5 text-sm font-medium flex items-center gap-2 hover:scale-105 transition-transform animate-scale-in border border-border/50 hover:border-primary/50"
									style={{ animationDelay: `${index * 0.1}s` }}
								>
									<feature.icon className="h-4 w-4 text-primary" />
									{feature.label}
								</div>
							))}
						</div>

						{/* Social Proof */}
						<div className="flex items-center gap-8 text-sm animate-fade-in animate-delay-300">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<BarChart3 className="h-4 w-4 text-primary" />
									<span className="text-2xl font-bold gradient-purple-blue bg-clip-text text-transparent">
										{pollCount.toLocaleString()}
									</span>
								</div>
								<p className="text-muted-foreground">Polls created</p>
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<Users className="h-4 w-4 text-secondary" />
									<span className="text-2xl font-bold gradient-purple-blue bg-clip-text text-transparent">
										{voteCount.toLocaleString()}
									</span>
								</div>
								<p className="text-muted-foreground">Votes cast</p>
							</div>
						</div>

						{/* Secondary CTA */}
						<div className="pt-4 animate-fade-in animate-delay-400">
							<Link
								to="/create"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 group"
							>
								Need advanced options?
								<span className="underline group-hover:no-underline">
									Try the full editor
								</span>
							</Link>
						</div>
					</div>

					{/* Right Column - Quick Create Form */}
					<div className="relative animate-slide-in-right animate-delay-200">
						{/* Gradient glow behind form */}
						<div className="absolute inset-0 gradient-glow rounded-3xl blur-3xl -z-10" />
						<QuickCreateForm />
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="container mx-auto px-4 py-20 relative">
				<div className="text-center mb-16 space-y-4 animate-fade-in">
					<h2 className="text-4xl font-bold">
						Why Choose{' '}
						<span className="gradient-purple-blue bg-clip-text text-transparent">
							Our Platform
						</span>
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Everything you need for engaging, real-time polling
					</p>
				</div>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					<FeatureCard
						icon={<Zap className="h-6 w-6" />}
						title="Instant Updates"
						description="Watch votes stream in realtime with WebSocket connections"
						delay={0}
					/>
					<FeatureCard
						icon={<BarChart3 className="h-6 w-6" />}
						title="Visual Insights"
						description="Beautiful animated charts that update as votes come in"
						delay={1}
					/>
					<FeatureCard
						icon={<Shield className="h-6 w-6" />}
						title="Privacy Respecting"
						description="Browser fingerprinting prevents duplicate votes without tracking"
						delay={2}
					/>
					<FeatureCard
						icon={<Globe className="h-6 w-6" />}
						title="Global Scale"
						description="Powered by Cloudflare and Supabase for worldwide performance"
						delay={3}
					/>
				</div>
			</section>

			{/* Use Cases */}
			<section className="container mx-auto px-4 py-20 relative">
				<div className="text-center mb-16 space-y-4 animate-fade-in">
					<h2 className="text-4xl font-bold">
						Trusted By{' '}
						<span className="gradient-purple-blue bg-clip-text text-transparent">
							Professionals
						</span>
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						From content creators to enterprise teams, our platform scales with your needs
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
					{[
						{
							title: 'Content Creators',
							description: 'Engage your audience during live streams and videos with instant polls',
							gradient: 'from-purple-500 to-pink-500',
						},
						{
							title: 'Corporate Teams',
							description: 'Make data-driven decisions with team-wide voting and feedback',
							gradient: 'from-blue-500 to-cyan-500',
						},
						{
							title: 'Event Organizers',
							description: 'Gather real-time feedback and audience participation at any scale',
							gradient: 'from-orange-500 to-red-500',
						},
						{
							title: 'Educators',
							description: 'Create interactive learning experiences with live classroom polls',
							gradient: 'from-green-500 to-emerald-500',
						},
						{
							title: 'Product Teams',
							description: 'Collect user feedback and prioritize features with your community',
							gradient: 'from-violet-500 to-purple-500',
						},
						{
							title: 'Community Managers',
							description: 'Drive engagement and make collective decisions with your members',
							gradient: 'from-indigo-500 to-blue-500',
						},
					].map((useCase, index) => (
						<div
							key={useCase.title}
							className="glass-strong rounded-2xl p-6 hover:scale-105 transition-all duration-300 border border-border/50 hover:border-primary/50 animate-fade-in group relative overflow-hidden"
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							<div className={`absolute top-0 right-0 w-24 h-24 bg-linear-to-br ${useCase.gradient} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
							<h3 className="text-lg font-semibold mb-2 relative z-10">{useCase.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed relative z-10">
								{useCase.description}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="container mx-auto px-4 py-20 relative">
				<div className="text-center mb-16 space-y-4 animate-fade-in">
					<h2 className="text-4xl font-bold">
						People{' '}
						<span className="gradient-purple-blue bg-clip-text text-transparent">
							Love It
						</span>
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Real feedback from real users driving engagement
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
					{[
						{
							quote: "We swapped static forms for live polls—engagement spiked 3x overnight.",
							author: "Sarah Chen",
							role: "Community Lead",
							company: "Tech Discord",
							rating: 5,
						},
						{
							quote: "Honestly the smoothest poll UX we've tried. People actually keep it open.",
							author: "Marcus Rodriguez",
							role: "Streaming Host",
							company: "Twitch Channel",
							rating: 5,
						},
						{
							quote: "Captured alignment in under 60 seconds during our product sync.",
							author: "Priya Patel",
							role: "Product Manager",
							company: "SaaS Startup",
							rating: 5,
						},
					].map((testimonial, index) => (
						<div
							key={index}
							className="glass-strong rounded-2xl p-6 space-y-4 hover:scale-105 hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/30 animate-fade-in group relative overflow-hidden"
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							{/* Gradient glow on hover */}
							<div className="absolute inset-0 bg-gradient-purple-blue opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl" />
							
							<div className="relative">
								{/* Star Rating */}
								<div className="flex gap-1 mb-3">
									{Array.from({ length: testimonial.rating }).map((_, i) => (
										<Star
											key={i}
											className="h-4 w-4 fill-primary text-primary"
										/>
									))}
								</div>
								
								{/* Quote */}
								<p className="text-sm leading-relaxed mb-4 text-foreground/90">
									"{testimonial.quote}"
								</p>
								
								{/* Author */}
								<div className="pt-4 border-t border-border/50">
									<p className="font-semibold text-sm">{testimonial.author}</p>
									<p className="text-xs text-muted-foreground">
										{testimonial.role} · {testimonial.company}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Sign In CTA Section */}
			{!user && (
				<section className="container mx-auto px-4 py-20 relative">
					<div className="max-w-4xl mx-auto">
						<div className="glass-strong rounded-3xl p-12 text-center space-y-8 relative overflow-hidden group border border-border/50 hover:border-primary/30 transition-all">
							{/* Gradient background effect */}
							<div className="absolute inset-0 gradient-mesh opacity-50" />
							<div className="absolute inset-0 bg-gradient-purple-blue opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl" />
							
							<div className="relative space-y-6">
								{/* Icon */}
								<div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-purple-blue flex items-center justify-center shadow-lg">
									<Sparkles className="h-8 w-8 text-white" />
								</div>
								
								{/* Heading */}
								<div className="space-y-3">
									<h2 className="text-3xl md:text-4xl font-bold">
										Sign in with Google for{' '}
										<span className="gradient-purple-blue bg-clip-text text-transparent">
											Advanced Features
										</span>
									</h2>
									<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
										Keep track of all your polls, access advanced analytics and embed widgets.
									</p>
								</div>
								
								{/* Features Grid */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
									{[
										{
											icon: BarChart3,
											label: "Dashboard & Analytics",
										},
										{
											icon: TrendingUp,
											label: "Poll Management",
										},
										{
											icon: MessageSquare,
											label: "Advanced Options",
										},
									].map((feature, index) => (
										<div
											key={index}
											className="glass rounded-xl px-4 py-3 flex items-center gap-3 justify-center hover:scale-105 transition-transform"
										>
											<feature.icon className="h-4 w-4 text-primary" />
											<span className="text-sm font-medium">{feature.label}</span>
										</div>
									))}
								</div>
								
								{/* CTA Button */}
								<div className="pt-4">
									<Button
										onClick={() => signInWithGoogle()}
										size="lg"
										className="bg-gradient-purple-blue text-white hover:opacity-90 shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg px-8"
									>
										<svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
											<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
											<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
											<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
										</svg>
										Continue with Google
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
									<p className="text-xs text-muted-foreground mt-4">
										Free forever • No credit card required
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Recent Polls Section */}
			<section className="container mx-auto px-4 py-20 relative">
				<div className="text-center mb-16 space-y-4 animate-fade-in">
					<h2 className="text-4xl font-bold">
						Recent{' '}
						<span className="gradient-purple-blue bg-clip-text text-transparent">
							Polls
						</span>
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						See what others are asking
					</p>
				</div>
				
				{pollsLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
						{Array.from({ length: 6 }).map((_, i) => (
							<Card key={i} className="glass-strong p-6 space-y-4 animate-pulse">
								<div className="h-4 bg-muted rounded w-3/4" />
								<div className="h-3 bg-muted rounded w-1/2" />
								<div className="flex gap-4 pt-2">
									<div className="h-3 bg-muted rounded w-16" />
									<div className="h-3 bg-muted rounded w-16" />
								</div>
							</Card>
						))}
					</div>
				) : recentPolls && recentPolls.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
						{recentPolls.map((poll, index) => (
							<Link
								key={poll._id}
								to={`/poll/${poll.slug}`}
								className="group"
							>
								<Card className="glass-strong p-6 space-y-4 hover:scale-105 hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/50 animate-fade-in h-full relative overflow-hidden"
									style={{ animationDelay: `${index * 0.05}s` }}
								>
									{/* Gradient glow on hover */}
									<div className="absolute inset-0 bg-gradient-purple-blue opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
									
									<div className="relative">
										{/* Poll Title */}
										<h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors mb-3">
											{poll.title}
										</h3>
										
										{/* Stats */}
										<div className="flex items-center gap-4 text-sm text-muted-foreground">
											<div className="flex items-center gap-1">
												<Users className="h-4 w-4" />
												<span>{poll.voteCount} {poll.voteCount === 1 ? 'vote' : 'votes'}</span>
											</div>
											<div className="flex items-center gap-1">
												<BarChart3 className="h-4 w-4" />
												<span>{poll.optionCount} options</span>
											</div>
										</div>
										
										{/* Time */}
										<div className="pt-3 border-t border-border/50 mt-4">
											<p className="text-xs text-muted-foreground flex items-center gap-1">
												<Clock className="h-3 w-3" />
												{formatDistanceToNow(poll._creationTime, { addSuffix: true })}
											</p>
										</div>
										
										{/* Hover Arrow */}
										<div className="absolute top-6 right-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300">
											<ArrowRight className="h-5 w-5 text-primary" />
										</div>
									</div>
								</Card>
							</Link>
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
							<BarChart3 className="h-8 w-8 text-muted-foreground" />
						</div>
						<h3 className="text-lg font-semibold mb-2">No polls yet</h3>
						<p className="text-muted-foreground mb-6">
							Be the first to create a poll!
						</p>
						<Button asChild className="bg-gradient-purple-blue text-white">
							<Link to="/create">
								<Sparkles className="mr-2 h-4 w-4" />
								Create First Poll
							</Link>
						</Button>
					</div>
				)}
			</section>

			{/* FAQ Section */}
			<section className="container mx-auto px-4 py-20 relative">
				<div className="max-w-3xl mx-auto">
					<div className="text-center mb-16 space-y-4 animate-fade-in">
						<h2 className="text-4xl font-bold">
							Frequently Asked{' '}
							<span className="gradient-purple-blue bg-clip-text text-transparent">
								Questions
							</span>
						</h2>
						<p className="text-muted-foreground text-lg">
							Everything you need to know about our polling platform
						</p>
					</div>
					<Accordion type="single" collapsible className="space-y-4">
						{[
							{
								question: 'Do I need to create an account to use the platform?',
								answer:
									'No! You can create and share polls instantly without signing up. However, creating an account allows you to manage your polls from a dashboard and track their performance.',
							},
							{
								question: 'How does the voting system prevent duplicates?',
								answer:
									'We use advanced browser fingerprinting technology to ensure each person can only vote once per poll, without requiring login or tracking personal information.',
							},
							{
								question: 'Are the results really updated in real-time?',
								answer:
									'Yes! We use WebSocket connections powered by Supabase Realtime to stream vote updates instantly to all viewers. You\'ll see results update live as votes come in.',
							},
							{
								question: 'Can I embed polls on my website?',
								answer:
									'Absolutely! Each poll comes with an embed code that you can place on any website. The embedded poll is fully functional with real-time updates.',
							},
							{
								question: 'Is there a limit to how many polls I can create?',
								answer:
									'Free users can create unlimited polls! We have rate limits to prevent abuse (5 polls per 5 minutes), but there\'s no cap on total polls.',
							},
							{
								question: 'How long do polls remain active?',
								answer:
									'Polls remain active indefinitely by default. You can optionally set an expiration date when creating a poll, or close it manually from your dashboard.',
							},
							{
								question: 'What types of polls can I create?',
								answer:
									'You can create single-choice polls (pick one option) or multiple-choice polls (pick several options). Both support up to 10 answer choices.',
							},
							{
								question: 'Is my data secure and private?',
								answer:
									'Yes! We take security seriously. All data is encrypted, we don\'t track personal information, and we use enterprise-grade infrastructure powered by Supabase and Cloudflare.',
							},
						].map((faq, index) => (
							<AccordionItem
								key={index}
								value={`item-${index}`}
								className="glass-strong rounded-xl px-6 border border-border/50 hover:shadow-lg transition-all animate-fade-in"
								style={{ animationDelay: `${index * 0.05}s` }}
							>
								<AccordionTrigger className="text-lg font-semibold hover:text-primary hover:no-underline py-6">
									{faq.question}
								</AccordionTrigger>
								<AccordionContent className="text-muted-foreground leading-relaxed pb-6">
									{faq.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</section>
		</div>
	)
}

function FeatureCard({
	icon,
	title,
	description,
	delay,
}: {
	icon: React.ReactNode
	title: string
	description: string
	delay: number
}) {
	return (
		<div
			className="glass-strong rounded-2xl p-6 hover:scale-105 hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/50 animate-fade-in group relative overflow-hidden"
			style={{ animationDelay: `${delay * 0.1}s` }}
		>
			{/* Gradient glow on hover */}
			<div className="absolute inset-0 bg-gradient-purple-blue opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
			
			<div className="relative">
				<div className="mb-4 inline-flex rounded-xl bg-gradient-purple-blue p-3.5 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
					{icon}
				</div>
				<h3 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">
					{title}
				</h3>
				<p className="text-sm text-muted-foreground leading-relaxed">
					{description}
				</p>
			</div>
		</div>
	)
}

