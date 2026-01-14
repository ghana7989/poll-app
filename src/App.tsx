import './App.css'

function App() {
	return (
		<>
			{JSON.stringify(import.meta.env, null, 2)}
			<br />
			<h1> Supabase URL </h1>
			<p>{import.meta.env.VITE_SUPABASE_URL}</p>
			<h1> Supabase Publishable Default Key </h1>
			<p>{import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY}</p>
			<h1> App URL </h1>
			<p>{import.meta.env.VITE_APP_URL}</p>
			<h1> App Name </h1>
			<p>{import.meta.env.VITE_APP_NAME}</p>
		</>
	)
}

export default App
