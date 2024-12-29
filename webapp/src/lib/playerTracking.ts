import { supabase } from '$lib/supabaseClient';
import { presenceChannel, onlinePlayers, presenceTimeouts } from '$lib/stores/playerTrackingStore';
import { get } from 'svelte/store';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface Presence {
	game: Game;
	player: Player;
	presence_ref: string;
}

export async function joinPresence(player: Player, game: Game) {
	let currentPresenceChannel: RealtimeChannel | null = get(presenceChannel);

	// Create the presence channel
	currentPresenceChannel = supabase
		.channel(`presence:${game.id}`)
		.on('presence', { event: 'sync' }, () => getPlayerStatus(game.id))
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

// write player status to store
async function getPlayerStatus(gameId: string) {
	const presenceState = get(presenceChannel)?.presenceState();

	const { data, error } = await supabase
		.from('Player')
		.select('id, is_online')
		.match({ game_id: gameId });

	if (!error && presenceState) {
		//MAY BE A TODO: check for consistancy between the presenceState and db

		for (const player of data) {
			onlinePlayers.update((players) => {
				players[player.id] = player.is_online;
				return players;
			});
		}
	}
}

async function handlePlayerOnline(player: Player) {
	// set the Player as online
	const response = await fetch('/api/player-active', {
		method: 'POST',
		body: JSON.stringify({ playerId: player.id, isActive: true }),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const { status, error } = await response.json();

	if (!response.ok || status === 'error') {
		console.error('Failed to update player (isActive):', error || 'Unknown error');
	}

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

	const time: number = game.status === 'not_started' ? 15000 : 5000;

	// Delay handling player offline to allow for page transitions/rejoins
	presenceTimeouts.update((timeouts) => {
		timeouts[player.id] = setTimeout(async () => {
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
