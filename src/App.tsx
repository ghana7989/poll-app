import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import { AppLayout } from '@/components/layout/app-layout'
import { AuthGuard } from '@/components/auth/auth-guard'
import { HomePage } from '@/pages/home'
import { LoginPage } from '@/pages/login'
import { CreatePage } from '@/pages/create'
import { PollPage } from '@/pages/poll'
import { DashboardPage } from '@/pages/dashboard'
import { EmbedPage } from '@/pages/embed'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Embed route - minimal UI, no layout */}
				<Route path='/embed/:slug' element={<EmbedPage />} />

				{/* Main app routes with layout */}
				<Route
					path='/*'
					element={
						<AppLayout>
							<Routes>
								<Route path='/' element={<HomePage />} />
								<Route path='/login' element={<LoginPage />} />
								<Route path='/poll/:slug' element={<PollPage />} />
								<Route
									path='/create'
									element={
										<AuthGuard>
											<CreatePage />
										</AuthGuard>
									}
								/>
								<Route
									path='/dashboard'
									element={
										<AuthGuard>
											<DashboardPage />
										</AuthGuard>
									}
								/>
								<Route path='*' element={<Navigate to='/' replace />} />
							</Routes>
						</AppLayout>
					}
				/>
			</Routes>
			<Toaster />
		</BrowserRouter>
	)
}

export default App
