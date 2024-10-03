import { createClient } from '@supabase/supabase-js'
import type { Database } from '$lib/database.types';

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey: string = import.meta.env.VITE_SUPABASE_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);