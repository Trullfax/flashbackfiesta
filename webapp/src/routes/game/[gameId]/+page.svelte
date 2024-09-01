<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { error } from '@sveltejs/kit';
	import CardComponent from '$lib/components/CardFront.svelte';

	export let data: PageData;

	const { gameId } = $page.params;

	let numberOfCards = 10;

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
		console.log('Chance recieved: ' + payload.new);

		const newPlayer = payload.new;
		const existingPlayerIndex = data.players.findIndex((player) => player.id === newPlayer.id);
		data.players[existingPlayerIndex] = { ...data.players[existingPlayerIndex], ...newPlayer };

		console.log(data.players);
	}

	function handleGameUpdates(payload: { new: any }) {
		console.log('Chance recieved: ' + payload.new);

		const newGame = payload.new;
		data.game = { ...data.game, ...newGame };

		console.log(data.game);
	}

	function handleCardUpdates(payload: { new: any }) {
		console.log('Chance recieved: ' + payload.new);

		const newCard = payload.new;
		const existingCardIndex = data.cards.findIndex((card) => card.id === newCard.id);
		data.cards[existingCardIndex] = { ...data.cards[existingCardIndex], ...newCard };

		console.log(data.cards);
	}

	async function generateCards() {
		try {
			// TODO: Add loading toast here.
			console.log('Generating cards...');
			const response = await fetch(data.category?.api_route ?? '', {
				method: 'POST',
				body: JSON.stringify({
					gameId,
					categoryId: data.category?.id,
					difficulty: data.game?.difficulty,
					numberOfCards
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`Failed to generate cards. Status: ${response.status}. Error: ${errorText}`
				);
			}

			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error || 'Failed to generate cards');
			}

			console.log('Cards generated successfully.');
		} catch (error) {
			console.error('Error:', (error as Error).message);
		}
	}

	// sort cards by year
	$: {
		data.cards.sort((a, b) => Number(a.year) - Number(b.year));
	}
</script>

<main class="h-screen flex flex-col items-center gap-10 bg-game-background bg-no-repeat bg-cover">
	<h1>Game Cards</h1>
	<h2>Category: {data.category?.name}</h2>

	<div>
		<input type="number" min="1" max="100" bind:value={numberOfCards} class="p-2 border rounded" />
		<button class="mt-2 p-2 bg-blue-500 text-white rounded" on:click={generateCards}>
			Generate Cards
		</button>
	</div>

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
