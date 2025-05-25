import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import type { Database } from '$lib/database.types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = publicEnv.PUBLIC_SUPABASE_URL || '';
const serviceKey: string = privateEnv.SERVICE_ROLE_KEY || '';

export const supabase =
	supabaseUrl && serviceKey ? createClient<Database>(supabaseUrl, serviceKey) : null;
