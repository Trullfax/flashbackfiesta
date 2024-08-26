import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const serviceKey = process.env.SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, serviceKey);