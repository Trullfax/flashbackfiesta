<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { addToast } from '$lib/stores/toastStore';
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { joinPresence, unsubscribePresence } from '$lib/playerTracking';
	import Toasts from '$lib/components/alert/Toasts.svelte';
	import PlayerSelection from '$lib/components/PlayerSelection.svelte';
	import PlayerLobby from '$lib/components/PlayerLobby.svelte';
	import Background from '$lib/components/Background.svelte';

	let pageTitle = 'Create your player · Flashbackfiesta';

	export let data: PageData;

	let playerLobbySection: HTMLElement;
	let playerSelectionSection: HTMLElement;

	const { gameId } = $page.params;

	let myPlayer: Player | null = null;
	let storedPlayerId: string | null = null;

	let settingUp: boolean = false;
	let isStarting: boolean = false;
	let isCreatingPlayer = false;

	onMount(() => {
		if (typeof window !== 'undefined') {
			storedPlayerId = localStorage.getItem('playerId');

			for (const player of data.players) {
				if (player.id === storedPlayerId) {
					myPlayer = player;
					pageTitle = 'Invite your friends · Flashbackfiesta';
					break;
				}
			}
		}

		if (myPlayer) {
			playerLobbySection?.scrollIntoView({ behavior: 'smooth' });
		} else {
			playerSelectionSection?.scrollIntoView({ behavior: 'smooth' });
		}

		if (myPlayer) {
			joinPresence(myPlayer, data.game);
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
			.on(
				'postgres_changes',
				{ event: 'DELETE', schema: 'public', filter: `game_id=eq.${gameId}`, table: 'Player' }, // ATTENTION: filter: 'id=eq.${gameId}' for event: DELETE not supported by Supabase
				handlePlayerDeletes
			)
			.on(
				'postgres_changes',
				{ event: 'DELETE', schema: 'public', filter: `id=eq.${gameId}`, table: 'Game' }, // ATTENTION: filter: 'id=eq.${gameId}' for event: DELETE not supported by Supabase
				handleGameDelete
			)
			.subscribe();

		return () => {
			unsubscribePresence();
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

	const handlePlayerInserts = (payload: { new: any }) => {
		const newPlayer = payload.new;
		data.players = [...data.players, newPlayer];
	};

	const handlePlayerDeletes = (payload: { old: any }) => {
		const deletedPlayerId = payload.old.id;
		data.players = data.players.filter((player) => player.id !== deletedPlayerId);
	};

	const handleGameUpdates = (payload: { new: any }) => {
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

	const handleGameDelete = (payload: { old: any }) => {
		if (payload.old.id === gameId) {
			console.warn('Game deleted');
			goto('/error');
		}
	};

	function handlePlayerSubmit(event: Event) {
		const { playerName, selectedAvatar } = (
			event as CustomEvent<{ playerName: string; selectedAvatar: string }>
		).detail;

		createPlayerAndScrollToPlayerLobby(playerName, selectedAvatar);
	}

	async function createPlayerAndScrollToPlayerLobby(playerName: string, selectedAvatar: string) {
		if (isCreatingPlayer || myPlayer) return;

		isCreatingPlayer = true;

		const isCreator: boolean = isCreatorCheck();

		const response = await fetch('/api/create-player/', {
			method: 'POST',
			body: JSON.stringify({ game: data.game, isCreator, playerName, selectedAvatar }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const { status, player, error } = await response.json();

		if (!response.ok || status === 'error') {
			addToast({ message: error || 'An unknown error occurred while creating the player', type: 'error' });
			return;
		}

		if (typeof window !== 'undefined') {
			localStorage.setItem('playerId', player.id);
		}

		myPlayer = player;

		if (myPlayer) {
			await joinPresence(myPlayer, data.game); // Join presence when player is created
		}

		playerLobbySection?.scrollIntoView({ behavior: 'smooth' });
		pageTitle = 'Invite your friends · Flashbackfiesta';

		isCreatingPlayer = false;
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

		console.log('status: ' + status + '\n error:' + error);

		if (!response.ok || status === 'error') {
			addToast({ message: error || 'An unknown error occurred while starting the game', type: 'error' });
			settingUp = false;
			isStarting = false;
			return;
		}

		isStarting = false;
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<Toasts />

<main class="overflow-hidden relative">
	<div class="-translate-y-[200dvh]">
		<Background />
	</div>
	<section
		bind:this={playerSelectionSection}
		class="h-dvh relative flex items-center justify-center p-6"
	>
		{#if !myPlayer}
			<PlayerSelection on:submit={handlePlayerSubmit} category={data.category} />
		{/if}
	</section>
	<section
		bind:this={playerLobbySection}
		class="h-dvh relative flex items-center justify-center p-6"
	>
		<PlayerLobby
			playerArray={data.players}
			isCreator={isCreatorCheck()}
			{settingUp}
			on:click={startGame}
		/>
	</section>
</main>
