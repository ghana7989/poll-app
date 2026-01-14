import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { loadConfig } from './utils/config'
import './index.css'
import App from './App.tsx'

// Load config BEFORE rendering React - top-level await
const config = await loadConfig()
if (!config) {
	throw new Error('Failed to load config')
}
// Configure TanStack Query client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: true,
			retry: 1,
		},
	},
})

// Now render - config available synchronously everywhere
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</StrictMode>
)
