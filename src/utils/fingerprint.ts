import FingerprintJS from '@fingerprintjs/fingerprintjs'

let fingerprintPromise: Promise<string> | null = null

/**
 * Check if we're in development mode
 * In dev mode, fingerprinting is disabled to allow testing
 */
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development'

/**
 * Generate a browser fingerprint for vote deduplication
 * Fingerprint is cached after first generation
 * In development mode, generates a random fingerprint to allow multiple votes
 */
export async function getBrowserFingerprint(): Promise<string> {
	// In development mode, generate a random fingerprint each time
	if (isDevelopment) {
		return `dev-fingerprint-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`
	}

	if (!fingerprintPromise) {
		fingerprintPromise = (async () => {
			const fp = await FingerprintJS.load()
			const result = await fp.get()
			return result.visitorId
		})()
	}
	return fingerprintPromise
}

/**
 * Hash fingerprint for secure storage
 * Using simple hash for demo - in production use crypto.subtle.digest
 */
export async function getHashedFingerprint(): Promise<string> {
	const fingerprint = await getBrowserFingerprint()

	// Check if crypto.subtle is available (requires secure context)
	if (crypto?.subtle?.digest) {
		// Use Web Crypto API for hashing
		const encoder = new TextEncoder()
		const data = encoder.encode(fingerprint)
		const hashBuffer = await crypto.subtle.digest('SHA-256', data)
		const hashArray = Array.from(new Uint8Array(hashBuffer))
		const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
		return hashHex
	}

	// Fallback: simple hash function for development
	// Note: This is NOT cryptographically secure, only for demo purposes
	let hash = 0
	for (let i = 0; i < fingerprint.length; i++) {
		const char = fingerprint.charCodeAt(i)
		hash = ((hash << 5) - hash) + char
		hash = hash & hash // Convert to 32-bit integer
	}
	return Math.abs(hash).toString(16).padStart(8, '0')
}
