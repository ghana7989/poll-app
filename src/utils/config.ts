export async function loadConfig() {
	const res = await fetch('/api/config')
	if (!res.ok) throw new Error('Failed to load config')
	return res.json()
}
