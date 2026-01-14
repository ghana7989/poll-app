import FingerprintJS from '@fingerprintjs/fingerprintjs'

let fingerprintPromise: Promise<string> | null = null

/**
 * Generate a browser fingerprint for vote deduplication
 * Fingerprint is cached after first generation
 */
export async function getBrowserFingerprint(): Promise<string> {
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

	// Use Web Crypto API for hashing
	const encoder = new TextEncoder()
	const data = encoder.encode(fingerprint)
	const hashBuffer = await crypto.subtle.digest('SHA-256', data)
	const hashArray = Array.from(new Uint8Array(hashBuffer))
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

	return hashHex
}
