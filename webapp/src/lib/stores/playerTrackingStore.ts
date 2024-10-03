import { writable } from 'svelte/store';
import { RealtimeChannel } from '@supabase/supabase-js';

// Store structure
export const presenceChannel = writable<RealtimeChannel | null>(null);
export const onlinePlayers = writable<Record<string, boolean>>({});
export const presenceTimeouts = writable<Record<string, NodeJS.Timeout | null>>({});
