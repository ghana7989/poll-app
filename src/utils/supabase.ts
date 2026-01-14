import { createClient } from '@supabase/supabase-js'
import { loadConfig } from './config'

const config = await loadConfig()

const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey)

export default supabase
