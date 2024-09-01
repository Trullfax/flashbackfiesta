<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { error } from '@sveltejs/kit';
	import CardComponent from '$lib/components/CardFront.svelte';

	export let data: PageData;

	const { gameId } = $page.params;

	onMount(() => {
		try {
			if (typeof window !== 'undefined') {
				const playerId = localStorage.getItem('playerId');

				if (!playerId) {
					throw new Error('playerId not found in local storage');
				}

				const playerExists = data.players.some((player) => player.id === playerId);

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
</script>

<main class="h-screen flex flex-col items-center gap-10 bg-game-background bg-no-repeat bg-cover">
	{#if data.cards.length > 0}
		<ul class="flex flex-row flex-wrap gap-5 mt-5">
			{#each data.cards as card}
				<li>
					<CardComponent
						title={card.name}
						subtitle={card.creator}
						imagePath={card.picture_url}
						accent_color={data.category?.hex_color ?? ''}
						year={Number(card.year)}
						revealed={true}
					/>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No cards to display. Click "Generate Cards" to fetch new cards.</p>
	{/if}
</main>
