/**
 * Application constants and limits
 */

export const POLL_LIMITS = {
	MIN_OPTIONS: 2,
	MAX_OPTIONS: 20,
	MAX_TITLE_LENGTH: 200,
	MAX_DESCRIPTION_LENGTH: 500,
	MAX_OPTION_LENGTH: 100,
	SLUG_LENGTH: 8,
} as const

export const RATE_LIMITS = {
	VOTES_PER_MINUTE: 10,
	POLLS_PER_5_MINUTES: 5,
} as const

export const POLL_VISIBILITY = {
	PUBLIC: 'public',
	UNLISTED: 'unlisted',
	PRIVATE: 'private',
} as const

export const POLL_TYPE = {
	SINGLE: 'single',
	MULTIPLE: 'multiple',
} as const

export const POLL_STATUS = {
	ACTIVE: 'active',
	CLOSED: 'closed',
} as const

export const ROUTES = {
	HOME: '/',
	LOGIN: '/login',
	CREATE: '/create',
	POLL: '/poll/:slug',
	DASHBOARD: '/dashboard',
	EMBED: '/embed/:slug',
} as const

export const LOCAL_STORAGE_KEYS = {
	VOTED_POLLS: 'pollify_voted_polls',
	AUTH_TOKEN: 'pollify_auth_token',
} as const
