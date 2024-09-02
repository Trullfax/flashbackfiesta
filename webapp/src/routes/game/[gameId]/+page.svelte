<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { error } from '@sveltejs/kit';
	import CardTable from '$lib/components/CardTable.svelte';
	import PlayerDeck from '$lib/components/PlayerDeck.svelte';
	import PlayerSelfDeck from '$lib/components/PlayerSelfDeck.svelte';

	export let data: PageData;
	let myPlayerId: string | null = null;
	let myPlayer: Player | null = null;
	let opponents: Player[] = [];
	let selectedCard: Card | null = null;

	// Reactive block to handle assigned player and opponents
	$: {
		try {
			if (myPlayerId && data.players) {
				myPlayer = data.players.find((player) => player.id === myPlayerId) || null;

				if (!myPlayer) {
					throw new Error(`Player with ID ${myPlayerId} not found`);
				}

				opponents = data.players.filter((player) => player.id !== myPlayerId);
			}
		} catch (err) {
			error(404, (err as Error).message);
		}
	}

	const { gameId } = $page.params;

	onMount(() => {
		try {
			if (typeof window !== 'undefined') {
				myPlayerId = localStorage.getItem('playerId');

				if (!myPlayerId) {
					throw new Error('player not found in local storage');
				}

				const playerExists = data.players.some((player) => player.id === myPlayerId);

				if (!playerExists) {
					throw new Error('no matching player found in game');
				}
			}
		} catch (err) {
			error(404, (err as Error).message);
		}

		const channels = supabase
			.channel(gameId)
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', filter: `game_id=eq.${gameId}`, table: 'Player' },
				handlePlayerUpdates
			)
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', filter: `id=eq.${gameId}`, table: 'Game' },
				handleGameUpdates
			)
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', filter: `game_id=eq.${gameId}`, table: 'Card' },
				handleCardUpdates
			)
			.subscribe();

		return () => {
			channels.unsubscribe();
		};
	});

	function handlePlayerUpdates(payload: { new: any }) {
		const newPlayer = payload.new;
		const existingPlayerIndex = data.players.findIndex((player) => player.id === newPlayer.id);
		data.players[existingPlayerIndex] = { ...data.players[existingPlayerIndex], ...newPlayer };
	}

	function handleGameUpdates(payload: { new: any }) {
		const newGame = payload.new;
		data.game = { ...data.game, ...newGame };
	}

	function handleCardUpdates(payload: { new: any }) {
		const newCard = payload.new;
		const existingCardIndex = data.cards.findIndex((card) => card.id === newCard.id);
		data.cards[existingCardIndex] = { ...data.cards[existingCardIndex], ...newCard };
	}

	// Compute classes based on number of opponents
	$: playerClasses = opponents.map((_, i) => {
		const count = opponents.length;
		switch (count) {
			case 1:
				return 'col-span-1-opponent';
			case 2:
				return 'col-span-2-opponent';
			case 3:
				return 'col-span-3-opponent';
			default:
				return '';
		}
	});

	function handleCardSubmit(event: Event) {
		try {
			const { myCardSelection } = (event as CustomEvent<{ myCardSelection: Card }>).detail;

			if (!myCardSelection) {
				throw new Error('something went wrong with the card selection');
			}
			selectedCard = myCardSelection;
		} catch (err) {
			console.error('Error:', (err as Error).message);
		}
	}

	function handleCardPlacement(event: CustomEvent<{ index: number; myCardSelection: Card }>) {
		try {
			const { index, myCardSelection } = event.detail;
			selectedCard = myCardSelection;
		} catch (err) {
			console.error('Error:', (err as Error).message);
		}
	}
</script>

<main class="h-screen grid grid-rows-3 items-center gap-5 bg-game-background bg-no-repeat bg-cover">
	<div class="grid grid-cols-6 gap-4 col-span-full">
		{#if opponents.length > 0}
			{#each opponents as player, i}
				<div class={playerClasses[i]}>
					<PlayerDeck
						{player}
						turn={data.game.whose_turn_id === player.id}
						category={data.category}
					/>
				</div>
			{/each}
		{/if}
	</div>

	<div class="col-span-full">
		<CardTable
			player={myPlayer}
			game={data.game}
			category={data.category}
			cards={data.tableCards}
			{selectedCard}
			on:placecard={handleCardPlacement}
		/>
	</div>

	<div class="col-span-full">
		{#if myPlayer}
			<PlayerSelfDeck
				{myPlayer}
				turn={data.game.whose_turn_id === myPlayer.id}
				category={data.category}
				cards={data.cards.filter((card) => myPlayer && card.player_id === myPlayer.id)}
				on:submitcard={handleCardSubmit}
			/>
		{/if}
	</div>
</main>
