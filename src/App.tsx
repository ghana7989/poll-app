import './App.css'

function App() {
	return (
		<>
			{JSON.stringify(import.meta.env, null, 2)}
			{import.meta.env.VITE_SUPABASE_URL}
		</>
	)
}

export default App
