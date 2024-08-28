import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '$lib/database.types';


const supabaseUrl: string = process.env.VITE_SUPABASE_URL || '';
const serviceKey: string = process.env.SERVICE_ROLE_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, serviceKey);