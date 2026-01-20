import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { useAuth } from '@/hooks/use-auth'
import { UserMenu } from '@/components/auth/user-menu'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { BarChart3 } from 'lucide-react'
import { getConfig } from '@/utils/config'

interface AppLayoutProps {
	children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
	const { user } = useAuth()
	const config = getConfig()

	return (
		<div className="min-h-screen flex flex-col">
			{/* Header */}
			<header className="sticky top-0 z-50 border-b border-border/40 glass-strong backdrop-blur-xl shadow-sm">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<Link
						to="/"
						className="flex items-center gap-2 text-xl font-bold group transition-all"
					>
						<BarChart3 className="h-6 w-6 text-primary group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
						<span className="gradient-purple-blue bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
							{config.appName}
						</span>
						<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 animate-pulse-subtle">
							BETA
						</span>
					</Link>

					<nav className="flex items-center gap-2 md:gap-4">
						{user ? (
							<>
								<Button variant="ghost" asChild className="hidden sm:inline-flex">
									<Link to="/dashboard">Dashboard</Link>
								</Button>
								<Button variant="default" asChild className="shadow-md hover:shadow-lg">
									<Link to="/create">Create Poll</Link>
								</Button>
								<ThemeToggle />
								<UserMenu />
							</>
						) : (
							<>
								<Button variant="ghost" asChild className="hidden sm:inline-flex">
									<Link to="/login">Sign In</Link>
								</Button>
								<Button variant="default" asChild className="shadow-md hover:shadow-lg">
									<Link to="/create">Create Poll</Link>
								</Button>
								<ThemeToggle />
							</>
						)}
					</nav>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1">{children}</main>

			{/* Footer */}
			<footer className="border-t border-border/40 mt-20 glass relative overflow-hidden">
				{/* Gradient glow effect */}
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
				
				<div className="container mx-auto px-4 py-12">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
						{/* Brand Column */}
						<div className="space-y-4">
							<Link to="/" className="flex items-center gap-2 text-lg font-bold group">
								<BarChart3 className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
								<span className="gradient-purple-blue bg-clip-text text-transparent">
									{config.appName}
								</span>
							</Link>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Create beautiful polls in seconds. Real-time results, no sign-up required.
							</p>
							{/* Social Links */}
							<div className="flex items-center gap-3">
								<a
									href="https://github.com/ghana7989/poll-app"
									target="_blank"
									rel="noopener noreferrer"
									className="w-9 h-9 rounded-lg glass-strong flex items-center justify-center hover:scale-110 hover:text-primary transition-all group"
									aria-label="GitHub"
								>
									<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
										<path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
									</svg>
								</a>
								<a
									href="https://twitter.com"
									target="_blank"
									rel="noopener noreferrer"
									className="w-9 h-9 rounded-lg glass-strong flex items-center justify-center hover:scale-110 hover:text-primary transition-all"
									aria-label="Twitter"
								>
									<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
										<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
									</svg>
								</a>
							</div>
						</div>

						{/* Product Column */}
						<div className="space-y-4">
							<h3 className="font-semibold text-sm">Product</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>
									<Link to="/create" className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
										<span className="group-hover:translate-x-0.5 transition-transform">Create Poll</span>
									</Link>
								</li>
								<li>
									<Link to="/" className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
										<span className="group-hover:translate-x-0.5 transition-transform">Features</span>
									</Link>
								</li>
								<li>
									<a href="#" className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
										<span className="group-hover:translate-x-0.5 transition-transform">Pricing</span>
									</a>
								</li>
							</ul>
						</div>

						{/* Resources Column */}
						<div className="space-y-4">
							<h3 className="font-semibold text-sm">Resources</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>
									<a href="#" className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
										<span className="group-hover:translate-x-0.5 transition-transform">Documentation</span>
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
										<span className="group-hover:translate-x-0.5 transition-transform">API</span>
									</a>
								</li>
								<li>
									<a href="https://github.com/ghana7989/poll-app" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
										<span className="group-hover:translate-x-0.5 transition-transform">GitHub</span>
									</a>
								</li>
							</ul>
						</div>

						{/* Company Column */}
						<div className="space-y-4">
							<h3 className="font-semibold text-sm">Company</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>
									<a href="#" className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
										<span className="group-hover:translate-x-0.5 transition-transform">About</span>
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
										<span className="group-hover:translate-x-0.5 transition-transform">Privacy</span>
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
										<span className="group-hover:translate-x-0.5 transition-transform">Terms</span>
									</a>
								</li>
							</ul>
						</div>
					</div>

					{/* Bottom Bar */}
					<div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
						<p>
							© {new Date().getFullYear()} {config.appName}. Built with ❤️ by{' '}
							<a
								href="https://github.com/ghana7989"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-foreground transition-colors font-medium"
							>
								Pavan Chindukuri
							</a>
						</p>
						<div className="flex items-center gap-4 text-xs">
							<span className="flex items-center gap-1">
								Powered by
								<a href="https://convex.dev" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors font-medium">
									Convex
								</a>
								&
								<a href="https://www.cloudflare.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors font-medium">
									Cloudflare
								</a>
							</span>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}
