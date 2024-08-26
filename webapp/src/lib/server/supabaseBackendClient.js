import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const serviceKey = process.env.SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, serviceKey);