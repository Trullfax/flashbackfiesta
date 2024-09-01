<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { addToast } from '$lib/stores/toastStore';
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import PlayerSelection from '$lib/components/PlayerSelection.svelte';
	import PlayerLobby from '$lib/components/PlayerLobby.svelte';

	export let data: PageData;

	const { gameId } = $page.params;

	let isPlayer = false;
	let settingUp = false;
	let isStarting = false;

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

		return () => {
			channels.unsubscribe();
		};
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

	const handlePlayerInserts = (payload: any) => {
		const newPlayer = payload.new;
		data.players = [...data.players, newPlayer];
	};

	const handleGameUpdates = (payload: any) => {
		const updatedGame = payload.new;
		data.game = updatedGame;

		// Redirect to game page if game status is running
		if (updatedGame.status === 'running') {
			// Ensure that `goto` is only called on the client (browser)
			if (typeof window !== 'undefined') {
				goto(`/game/${gameId}`);
			}
		}

		if (updatedGame.status === 'setting_up') {
			settingUp = true;
		} else {
			settingUp = false;
		}
	};

	function handlePlayerSubmit(event: Event) {
		const { playerName, selectedAvatar } = (
			event as CustomEvent<{ playerName: string; selectedAvatar: string }>
		).detail;

		createPlayerAndScrollToPlayerLobby(playerName, selectedAvatar);
	}

	async function createPlayerAndScrollToPlayerLobby(playerName: string, selectedAvatar: string) {
		const isCreator: boolean = isCreatorCheck();

		const response = await fetch('/api/create-player/', {
			method: 'POST',
			body: JSON.stringify({ game: data.game, isCreator, playerName, selectedAvatar }),
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

	async function startGame() {
		if (isStarting || !isCreatorCheck() || settingUp) return;

		isStarting = true;

		const response = await fetch('/api/start-game/', {
			method: 'POST',
			body: JSON.stringify({ game: data.game, category: data.category, players: data.players }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const { status, error } = await response.json();

		if (status === 'error') {
			// const response = await fetch('/api/start-game/', {
			// 	method: 'PUT',
			// 	body: JSON.stringify({ gameId }),
			// 	headers: {
			// 		'Content-Type': 'application/json'
			// 	}
			// });

			addToast({ message: error, type: 'error' });
			settingUp = false;
			return;
		}

		isStarting = false;
	}
</script>

<main class="overflow-hidden">
	{#if !isPlayer}
		<section
			class="h-screen flex items-center justify-center bg-flash-background bg-no-repeat bg-cover bg-[center_bottom_-100vh]"
		>
			<PlayerSelection on:submit={handlePlayerSubmit} category={data.category} />
		</section>
	{/if}
	<section
		id="playerLobby-section"
		class="h-screen flex items-center justify-center bg-flash-background bg-no-repeat bg-cover bg-[center_bottom]"
	>
		<PlayerLobby
			playerArray={data.players}
			isCreator={isCreatorCheck()}
			{settingUp}
			on:click={startGame}
		/>
	</section>
</main>
