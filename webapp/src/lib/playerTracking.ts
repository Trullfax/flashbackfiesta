import { supabase } from '$lib/supabaseClient';
import { presenceChannel, onlinePlayers, presenceTimeouts } from '$lib/stores/playerTrackingStore';
import { get } from 'svelte/store'; // Used to get the current value of a store
import type { RealtimeChannel } from '@supabase/supabase-js';

interface Presence {
	game: Game;
	player: Player;
	presence_ref: string;
}

export async function joinPresence(player: Player, game: Game) {
	let currentPresenceChannel: RealtimeChannel | null = get(presenceChannel);
	if (
		currentPresenceChannel !== null &&
		String(currentPresenceChannel.subTopic) !== String(`presence:${game.id}`)
	) {
		handlePlayerOnline(player);
	} else {
		// Create the presence channel
		currentPresenceChannel = supabase
			.channel(`presence:${game.id}`)
			.on('presence', { event: 'sync' }, () => {})
			.on('presence', { event: 'join' }, ({ newPresences }) =>
				handlePlayerOnline(newPresences[0].player)
			)
			.on('presence', { event: 'leave' }, ({ leftPresences }) =>
				handlePlayerOffline(leftPresences as Presence[])
			)
			.subscribe();
		// Update the store with the new presence channel
		presenceChannel.set(currentPresenceChannel);
		// Join the presence channel with the player ID
		await currentPresenceChannel.track({ player: player, game: game });
	}
}

function handlePlayerOnline(player: Player) {
	onlinePlayers.update((players) => {
		players[player.id] = true; // Mark the player as online
		return players;
	});

	// Clear the timeout for this player if it exists
	presenceTimeouts.update((timeouts) => {
		if (timeouts[player.id] !== null) {
			clearTimeout(timeouts[player.id] as NodeJS.Timeout);
			timeouts[player.id] = null;
		}
		return timeouts;
	});
}

async function handlePlayerOffline(leftPresences: Presence[]) {
	const player = leftPresences[0].player;
	const game = leftPresences[0].game;

	// Mark the player as offline right away
	onlinePlayers.update((players) => {
		players[player.id] = false; // Mark the player as offline
		return players;
	});

	const time: number = game.status === 'not_started' ? 15000 : 15000;

	// Delay handling player offline to allow for page transitions/rejoins
	presenceTimeouts.update((timeouts) => {
		timeouts[player.id] = setTimeout(async () => {
			// Re-check the player's online status at the time of timeout
			if (get(onlinePlayers)[player.id]) {
				return; // Player rejoined, no need to timeout
			}

			const response = await fetch('/api/player-timeout', {
				method: 'POST',
				body: JSON.stringify({ player, gameId: game.id }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const { status, error } = await response.json();

			if (!response.ok || status === 'error') {
				console.error('Failed to delete player:', error || 'Unknown error');
			} else {
				console.warn('Player timed out:', player.name);
			}
		}, time);

		return timeouts;
	});
}

export function unsubscribePresence() {
	const currentPresenceChannel = get(presenceChannel);
	currentPresenceChannel?.unsubscribe();

	presenceChannel.set(null);
	onlinePlayers.set({});
	presenceTimeouts.set({});
}
