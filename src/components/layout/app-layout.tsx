import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { useAuth } from '@/hooks/use-auth'
import { UserMenu } from '@/components/auth/user-menu'
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
			<header className="sticky top-0 z-50 border-b border-border/40 glass backdrop-blur-xl">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<Link to="/" className="flex items-center gap-2 text-xl font-bold">
						<BarChart3 className="h-6 w-6 text-primary" />
						<span className="gradient-purple-blue bg-clip-text text-transparent">
							{config.appName}
						</span>
					</Link>

					<nav className="flex items-center gap-4">
						{user ? (
							<>
								<Button variant="ghost" asChild>
									<Link to="/dashboard">Dashboard</Link>
								</Button>
								<Button variant="default" asChild>
									<Link to="/create">Create Poll</Link>
								</Button>
								<UserMenu />
							</>
						) : (
							<>
								<Button variant="ghost" asChild>
									<Link to="/login">Sign In</Link>
								</Button>
							</>
						)}
					</nav>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1">{children}</main>

			{/* Footer */}
			<footer className="border-t border-border/40 py-8">
				<div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
					<p>
						© {new Date().getFullYear()} {config.appName}. Built with React, Supabase
						& Cloudflare.
					</p>
				</div>
			</footer>
		</div>
	)
}
