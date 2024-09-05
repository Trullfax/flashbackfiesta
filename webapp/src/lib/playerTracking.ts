import { supabase } from '$lib/supabaseClient';

let presenceTimeout: any = null;

export async function joinPresence(player: Player, gameId: string) {
    const presenceChannel = supabase
        .channel(`presence:${gameId}`)
        .on('presence', { event: 'sync' }, () => {
            const newState = presenceChannel.presenceState();
            console.log('sync', newState);
        })
        .on('presence', { event: 'join' }, (player) => handlePlayerOnline)
        .on('presence', { event: 'leave' }, (player) => handlePlayerOffline)
        .subscribe();

    // Join the presence channel with the player ID
    await presenceChannel.track({ id: player.id });
}

function handlePlayerOnline(player: Player) {
    clearTimeout(presenceTimeout);
    console.log(`${player.id} rejoined the game.`);
}

function handlePlayerOffline(player: Player) {
    console.log(`${player.id} went offline.`);
    presenceTimeout = setTimeout(() => {
        // Remove player from the game after timeout
        // removePlayer(player.id);
        console.log(`${player.id} was removed from the game.`);
    }, 60000); // 1 minute timeout
}

async function removePlayer(playerId: string) {
    // const response = await fetch('/api/remove-player/', {
    // 	method: 'POST',
    // 	body: JSON.stringify({ gameId, playerId }),
    // 	headers: {
    // 		'Content-Type': 'application/json'
    // 	}
    // });
    // const { status, error } = await response.json();
    // if (!response.ok || status === 'error') {
    // 	addToast({ message: error || 'An unknown error occurred', type: 'error' });
    // 	return;
    // }
    // if (typeof window !== 'undefined') {
    // 	localStorage.removeItem('playerId');
    // }
}
