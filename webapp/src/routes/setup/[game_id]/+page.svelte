<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { addToast } from '$lib/stores/toastStore';

	import PlayerSelection from '$lib/components/PlayerSelection.svelte';
	import PlayerLobby from '$lib/components/PlayerLobby.svelte';

	export let data: PageData;

	const { game_id } = $page.params;

	function handlePlayerSubmit(event: Event) {
		const { playername, selectedAvatar } = (
			event as CustomEvent<{ playername: string; selectedAvatar: string }>
		).detail;

		createPlayerAndScrollToPlayerLobby(playername, selectedAvatar);
	}

	async function createPlayerAndScrollToPlayerLobby(player_name: string, avatar_path: string) {
		const response = await fetch('/setup', {
			method: 'POST',
			body: JSON.stringify({ game_id, player_name, avatar_path }),
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
		<PlayerLobby />
	</section>
</main>
