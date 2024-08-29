<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { addToast } from '$lib/stores/toastStore';
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	import PlayerSelection from '$lib/components/PlayerSelection.svelte';
	import PlayerLobby from '$lib/components/PlayerLobby.svelte';

	export let data: PageData;

	const { gameId } = $page.params;

	let isPlayer = false;

	onMount(() => {
		if (typeof window !== 'undefined') {
			const playerId = localStorage.getItem('playerId');

			for (const player of data.players) {
				if (player.id === playerId) {
					isPlayer = true;
					break;
				}
			}
		}
	});

	function isCreatorCheck() {
		// Check if window is defined to confirm that code is running in the browser
		if (typeof window !== 'undefined') {
			const creatorCode: string = localStorage.getItem('creatorCode') ?? '';

			if (creatorCode === data.game?.creator_code) {
				return true;
			}
		}
		return false;
	}

	const handlePlayerInserts = (payload) => {
		const newPlayer = payload.new;
		data.players = [...data.players, newPlayer];
	};

	const handleGameUpdates = (payload) => {
		const updatedGame = payload.new;
		data.game = updatedGame;

		// TODO: Redirect to game page if game status is running (the following code does NOT work)
		// if (updatedGame.status === 'running') {
		// 	goto(`/game/${gameId}`);
		// }
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
		const response = await fetch('/api/create-player/', {
			method: 'POST',
			body: JSON.stringify({ gameId, playerName, selectedAvatar }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const { status, player, error } = await response.json();

		if (status === 'error') {
			addToast({ message: error, type: 'error' });
			return;
		}

		// set playerId in internal storage
		if (typeof window !== 'undefined') {
			localStorage.setItem('playerId', player.id);
		}

		// scroll to player lobby
		document.getElementById('playerLobby-section')?.scrollIntoView({ behavior: 'smooth' });
	}

	function startGame() {
		if (isCreatorCheck()) {
			const response = fetch('/api/start-game/', {
				method: 'PUT',
				body: JSON.stringify({ gameId }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
	}
</script>

<main class="overflow-hidden">
	{#if !isPlayer}
		<section class="h-screen flex items-center justify-center">
			<PlayerSelection on:submit={handlePlayerSubmit} category={data.category} />
		</section>
	{/if}
	<section id="playerLobby-section" class="h-screen flex items-center justify-center">
		<PlayerLobby playerArray={data.players} isCreator={isCreatorCheck()} on:click={startGame} />
	</section>
</main>
