export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: '14.1'
	}
	public: {
		Tables: {
			poll_options: {
				Row: {
					created_at: string | null
					id: string
					image_url: string | null
					label: string
					poll_id: string
					position: number
				}
				Insert: {
					created_at?: string | null
					id?: string
					image_url?: string | null
					label: string
					poll_id: string
					position: number
				}
				Update: {
					created_at?: string | null
					id?: string
					image_url?: string | null
					label?: string
					poll_id?: string
					position?: number
				}
				Relationships: [
					{
						foreignKeyName: 'poll_options_poll_id_fkey'
						columns: ['poll_id']
						isOneToOne: false
						referencedRelation: 'polls'
						referencedColumns: ['id']
					}
				]
			}
			polls: {
				Row: {
					allow_embed: boolean | null
					closes_at: string | null
					created_at: string | null
					creator_id: string | null
					description: string | null
					id: string
					max_selections: number | null
					require_auth_to_vote: boolean | null
					show_results_before_vote: boolean | null
					slug: string
					status: Database['public']['Enums']['poll_status']
					title: string
					type: Database['public']['Enums']['poll_type']
					updated_at: string | null
					visibility: Database['public']['Enums']['poll_visibility']
				}
				Insert: {
					allow_embed?: boolean | null
					closes_at?: string | null
					created_at?: string | null
					creator_id?: string | null
					description?: string | null
					id?: string
					max_selections?: number | null
					require_auth_to_vote?: boolean | null
					show_results_before_vote?: boolean | null
					slug: string
					title: string
					type?: Database['public']['Enums']['poll_type']
					updated_at?: string | null
					visibility?: Database['public']['Enums']['poll_visibility']
				}
				Update: {
					allow_embed?: boolean | null
					closes_at?: string | null
					created_at?: string | null
					creator_id?: string | null
					description?: string | null
					id?: string
					max_selections?: number | null
					require_auth_to_vote?: boolean | null
					show_results_before_vote?: boolean | null
					slug?: string
					status?: Database['public']['Enums']['poll_status']
					title?: string
					type?: Database['public']['Enums']['poll_type']
					updated_at?: string | null
					visibility?: Database['public']['Enums']['poll_visibility']
				}
				Relationships: [
					{
						foreignKeyName: 'polls_creator_id_fkey'
						columns: ['creator_id']
						isOneToOne: false
						referencedRelation: 'profiles'
						referencedColumns: ['id']
					}
				]
			}
			profiles: {
				Row: {
					avatar_url: string | null
					created_at: string | null
					email: string | null
					full_name: string | null
					id: string
				}
				Insert: {
					avatar_url?: string | null
					created_at?: string | null
					email?: string | null
					full_name?: string | null
					id: string
				}
				Update: {
					avatar_url?: string | null
					created_at?: string | null
					email?: string | null
					full_name?: string | null
					id?: string
				}
				Relationships: []
			}
			rate_limits: {
				Row: {
					action: string
					count: number
					id: string
					identifier: string
					window_start: string
				}
				Insert: {
					action: string
					count?: number
					id?: string
					identifier: string
					window_start?: string
				}
				Update: {
					action?: string
					count?: number
					id?: string
					identifier?: string
					window_start?: string
				}
				Relationships: []
			}
			votes: {
				Row: {
					created_at: string | null
					id: string
					option_id: string
					poll_id: string
					voter_fingerprint: string
					voter_id: string | null
				}
				Insert: {
					created_at?: string | null
					id?: string
					option_id: string
					poll_id: string
					voter_fingerprint: string
					voter_id?: string | null
				}
				Update: {
					created_at?: string | null
					id?: string
					option_id?: string
					poll_id?: string
					voter_fingerprint?: string
					voter_id?: string | null
				}
				Relationships: [
					{
						foreignKeyName: 'votes_option_id_fkey'
						columns: ['option_id']
						isOneToOne: false
						referencedRelation: 'poll_options'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'votes_poll_id_fkey'
						columns: ['poll_id']
						isOneToOne: false
						referencedRelation: 'polls'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'votes_voter_id_fkey'
						columns: ['voter_id']
						isOneToOne: false
						referencedRelation: 'profiles'
						referencedColumns: ['id']
					}
				]
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			generate_slug: { Args: never; Returns: string }
		}
		Enums: {
			poll_status: 'active' | 'closed'
			poll_type: 'single' | 'multiple'
			poll_visibility: 'public' | 'unlisted' | 'private'
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
				DefaultSchema['Views'])
		? (DefaultSchema['Tables'] &
				DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R
			}
			? R
			: never
		: never

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I
			}
			? I
			: never
		: never

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U
			}
			? U
			: never
		: never

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema['Enums']
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never

export const Constants = {
	public: {
		Enums: {
			poll_status: ['active', 'closed'],
			poll_type: ['single', 'multiple'],
			poll_visibility: ['public', 'unlisted', 'private'],
		},
	},
} as const
