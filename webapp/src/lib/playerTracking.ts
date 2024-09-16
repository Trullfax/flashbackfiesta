import { supabase } from '$lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Presence {
    game: Game;
    player: Player;
    presence_ref: string;
}

let presenceTimeout: NodeJS.Timeout | null = null;
let presenceChannel: RealtimeChannel | null = null;

export async function joinPresence(player: Player, game: Game) {
    // Create the presence channel
    presenceChannel = supabase
        .channel(`presence:${game.id}`)
        .on('presence', { event: 'sync' }, () => {})
        .on('presence', { event: 'join' }, () => handlePlayerOnline())
        .on('presence', { event: 'leave' }, ({ leftPresences }) => handlePlayerOffline(leftPresences as Presence[]))
        .subscribe();

    // Join the presence channel with the player ID
    await presenceChannel.track({ player: player, game: game });
}

function handlePlayerOnline() {
    if (presenceTimeout !== null) {
        clearTimeout(presenceTimeout);
    }
}

async function handlePlayerOffline(leftPresences: Presence[]) {
    const player = leftPresences[0].player;
    const game = leftPresences[0].game;

    const time: number = game.status === 'not_started' ? 5000 : 20000;

    presenceTimeout = setTimeout(async () => {
        const response = await fetch('/api/player-timeout', {
            method: 'POST',
            body: JSON.stringify({ player, game }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        const { status, error } = await response.json();
    
        if (!response.ok || status === 'error') {
            console.error('Failed to delete player:', error || 'Unknown error');
        }

        console.warn('Player timed out:', player.name);
    }, time);
}

export function unsubscribePresense() {
    presenceChannel?.unsubscribe();
}
