import './App.css'
import { loadConfig } from './utils/config'

const config = await loadConfig()
console.log(config)

function App() {
	return (
		<>
			{JSON.stringify(import.meta.env, null, 2)}
			<br />
			<h1> Supabase URL </h1>
			<p>{config.supabaseUrl}</p>
			<h1> Supabase Publishable Default Key </h1>
			<p>{config.supabasePublishableDefaultKey}</p>
			<h1> App URL </h1>
			<p>{config.appUrl}</p>
			<h1> App Name </h1>
			<p>{config.appName}</p>
		</>
	)
}

export default App
