<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { addToast } from '$lib/stores/toastStore';
	import { supabase } from '$lib/supabaseClient';

	import PlayerSelection from '$lib/components/PlayerSelection.svelte';
	import PlayerLobby from '$lib/components/PlayerLobby.svelte';

	export let data: PageData;
	console.log(data);

	const { gameId } = $page.params;

	const handlePlayerInserts = (payload) => {
		const newPlayer = payload.new;
		data.players = [...data.players, newPlayer];
	};

	const handleGameUpdates = (payload) => {
		const updatedGame = payload.new;
		data.game = updatedGame;
	};

	const channels = supabase
		.channel(gameId)
		.on(
			'postgres_changes',
			{ event: 'INSERT', schema: 'public', filter: `game_id=eq.${gameId}`, table: 'Player' },
			handlePlayerInserts
		)
		.on(
			'postgres_changes',
			{ event: 'UPDATE', schema: 'public', filter: `id=eq.${gameId}`, table: 'Game' },
			handleGameUpdates
		)
		.subscribe();

	function handlePlayerSubmit(event: Event) {
		const { playerName, selectedAvatar } = (
			event as CustomEvent<{ playerName: string; selectedAvatar: string }>
		).detail;

		createPlayerAndScrollToPlayerLobby(playerName, selectedAvatar);
	}

	async function createPlayerAndScrollToPlayerLobby(playerName: string, selectedAvatar: string) {
		const response = await fetch('/setup', {
			method: 'POST',
			body: JSON.stringify({ gameId, playerName, selectedAvatar }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const { player, error } = await response.json();

		if (error) {
			addToast({ message: error, type: 'error' });
			return;
		} else if (!player) {
			addToast({ message: 'player could not created', type: 'error' });
			return;
		}

		// set player_id in internal storage
		localStorage.setItem('player_id', player.id);

		// scroll to player lobby
		document.getElementById('playerLobby-section')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<main class="overflow-hidden">
	<section class="h-screen flex items-center justify-center">
		<PlayerSelection on:submit={handlePlayerSubmit} category={data.category} />
	</section>
	<section id="playerLobby-section" class="h-screen flex items-center justify-center">
		<PlayerLobby playerArray={data.players} />
	</section>
</main>
