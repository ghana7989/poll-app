// Convex-based types
// Import from Convex generated types
export type { Id } from '../../convex/_generated/dataModel'

// Re-export common types for compatibility
export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]
