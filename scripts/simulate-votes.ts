#!/usr/bin/env tsx

/**
 * Simulate Live Votes Script
 *
 * This script simulates multiple users voting on a poll in real-time.
 * Useful for testing the live updates and visualization features.
 *
 * Usage:
 *   npm run simulate-votes <poll-id> [options]
 *
 * Options:
 *   --count <number>     Number of votes to simulate (default: 10)
 *   --interval <ms>      Time between votes in milliseconds (default: 1000)
 *   --random-delay       Add random delay variation (0-2x interval)
 *
 * Example:
 *   npm run simulate-votes abc123 --count 20 --interval 500 --random-delay
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .dev.vars
config({ path: resolve(process.cwd(), '.dev.vars') })

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
	console.error(
		'❌ Error: SUPABASE_URL and SUPABASE_PUBLISHABLE_DEFAULT_KEY must be set in .dev.vars'
	)
	process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

interface PollOption {
	id: string
	label: string
}

interface Poll {
	id: string
	title: string
	type: 'single' | 'multiple'
	options: PollOption[]
}

/**
 * Generate a random fingerprint for simulation
 */
function generateRandomFingerprint(): string {
	return `sim-${Math.random()
		.toString(36)
		.substring(2, 15)}-${Date.now()}-${Math.random()
		.toString(36)
		.substring(2, 8)}`
}

/**
 * Get poll details including options
 * Accepts either a slug or UUID
 */
async function getPoll(pollIdentifier: string): Promise<Poll | null> {
	// Try to determine if it's a UUID or slug
	const isUUID =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
			pollIdentifier
		)

	const { data: poll, error } = await supabase
		.from('polls')
		.select('id, title, type, options:poll_options(id, label)')
		.eq(isUUID ? 'id' : 'slug', pollIdentifier)
		.order('position', { referencedTable: 'poll_options', ascending: true })
		.single()

	if (error) {
		console.error('Error fetching poll:', error.message)
		return null
	}

	return poll as unknown as Poll
}

/**
 * Cast a vote with a random fingerprint
 */
async function castVote(pollId: string, optionIds: string[]): Promise<boolean> {
	const fingerprint = generateRandomFingerprint()

	const votes = optionIds.map((optionId) => ({
		poll_id: pollId,
		option_id: optionId,
		voter_id: null, // Simulated votes are anonymous
		voter_fingerprint: fingerprint,
	}))

	const { error } = await supabase.from('votes').insert(votes)

	if (error) {
		console.error('Error casting vote:', error.message)
		return false
	}

	return true
}

/**
 * Select random option(s) from poll
 */
function selectRandomOptions(poll: Poll): string[] {
	const numOptions =
		poll.type === 'multiple'
			? Math.floor(Math.random() * poll.options.length) + 1 // 1 to all options
			: 1 // Single option

	const shuffled = [...poll.options].sort(() => Math.random() - 0.5)
	return shuffled.slice(0, numOptions).map((opt) => opt.id)
}

/**
 * Main simulation function
 */
async function simulateVotes(
	pollIdentifier: string,
	count: number = 10,
	interval: number = 1000,
	randomDelay: boolean = false
) {
	console.log('🗳️  Poll Vote Simulator\n')
	console.log(`Poll: ${pollIdentifier}`)
	console.log(`Votes to simulate: ${count}`)
	console.log(
		`Interval: ${interval}ms${randomDelay ? ' (with random delay)' : ''}`
	)
	console.log('')

	// Fetch poll details
	console.log('📊 Fetching poll details...')
	const poll = await getPoll(pollIdentifier)

	if (!poll) {
		console.error('❌ Poll not found or error fetching poll')
		process.exit(1)
	}

	console.log(`✅ Poll found: "${poll.title}"`)
	console.log(`   Options: ${poll.options.map((o) => o.label).join(', ')}`)
	console.log(
		`   Multiple votes allowed: ${poll.type === 'multiple' ? 'Yes' : 'No'}`
	)
	console.log('')

	// Simulate votes
	console.log('🚀 Starting vote simulation...\n')

	let successCount = 0
	let failCount = 0

	for (let i = 0; i < count; i++) {
		const selectedOptions = selectRandomOptions(poll)
		const optionLabels = selectedOptions
			.map((id) => poll.options.find((o) => o.id === id)?.label)
			.join(', ')

		process.stdout.write(`Vote ${i + 1}/${count}: ${optionLabels}... `)

		const success = await castVote(poll.id, selectedOptions)

		if (success) {
			console.log('✅')
			successCount++
		} else {
			console.log('❌')
			failCount++
		}

		// Wait before next vote (except for last one)
		if (i < count - 1) {
			const delay = randomDelay ? Math.random() * interval * 2 : interval
			await new Promise((resolve) => setTimeout(resolve, delay))
		}
	}

	console.log('')
	console.log('📈 Simulation complete!')
	console.log(`   ✅ Successful votes: ${successCount}`)
	console.log(`   ❌ Failed votes: ${failCount}`)
	console.log('')
	console.log(`🔗 View results: ${process.env.APP_URL}/poll/${poll.id}`)
}

// Parse command line arguments
const args = process.argv.slice(2)

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
	console.log(`
Usage: npm run simulate-votes <poll-slug-or-id> [options]

Options:
  --count <number>     Number of votes to simulate (default: 10)
  --interval <ms>      Time between votes in milliseconds (default: 1000)
  --random-delay       Add random delay variation (0-2x interval)
  --help, -h           Show this help message

Example:
  npm run simulate-votes abc123 --count 20 --interval 500 --random-delay
	`)
	process.exit(0)
}

const pollIdentifier = args[0]
const countIndex = args.indexOf('--count')
const intervalIndex = args.indexOf('--interval')
const randomDelay = args.includes('--random-delay')

const count = countIndex !== -1 ? parseInt(args[countIndex + 1], 10) : 10
const interval =
	intervalIndex !== -1 ? parseInt(args[intervalIndex + 1], 10) : 1000

if (!pollIdentifier) {
	console.error('❌ Error: Poll slug or ID is required')
	process.exit(1)
}

if (isNaN(count) || count < 1) {
	console.error('❌ Error: --count must be a positive number')
	process.exit(1)
}

if (isNaN(interval) || interval < 0) {
	console.error('❌ Error: --interval must be a non-negative number')
	process.exit(1)
}

// Run simulation
simulateVotes(pollIdentifier, count, interval, randomDelay).catch((error) => {
	console.error('❌ Simulation error:', error)
	process.exit(1)
})
