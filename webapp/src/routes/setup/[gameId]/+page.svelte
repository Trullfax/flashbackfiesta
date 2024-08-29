<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { addToast } from '$lib/stores/toastStore';
	import { supabase } from '$lib/supabaseClient';
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

	const handleInserts = (payload) => {
		console.log('Change received!', payload);
	};

	const channels = supabase
		.channel(gameId)
		.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Player' }, handleInserts)
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

		const { player, error } = await response.json();

		if (error) {
			addToast({ message: error, type: 'error' });
			return;
		} else if (!player) {
			addToast({ message: 'player could not created', type: 'error' });
			return;
		}

		// set playerId in internal storage
		if (typeof window !== 'undefined') {
			localStorage.setItem('playerId', player.id);
		}

		// scroll to player lobby
		document.getElementById('playerLobby-section')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<main class="overflow-hidden">
	{#if !isPlayer}
		<section class="h-screen flex items-center justify-center">
			<PlayerSelection on:submit={handlePlayerSubmit} category={data.category} />
		</section>
	{/if}
	<section id="playerLobby-section" class="h-screen flex items-center justify-center">
		<PlayerLobby playerArray={data.players} isCreator={isCreatorCheck()} />
	</section>
</main>
