<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { error } from '@sveltejs/kit';
	import CardTable from '$lib/components/CardTable.svelte';

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

	// sort cards by year
	$: {
		data.cards.sort((a, b) => Number(a.year) - Number(b.year));
	}
</script>

<main class="h-screen flex flex-col items-center gap-10 bg-game-background bg-no-repeat bg-cover">
	<div>
		<CardTable game={data.game} category={data.category} cards={data.cards} />
	</div>
</main>
