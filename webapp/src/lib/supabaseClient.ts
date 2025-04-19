import { env } from '$env/dynamic/public';
import type { Database } from '$lib/database.types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = env.PUBLIC_SUPABASE_URL || '';
const supabaseKey: string = env.PUBLIC_SUPABASE_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
