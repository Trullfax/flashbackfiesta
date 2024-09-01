<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import CardFront from '$lib/components/CardFront.svelte';
	import CardTable from '$lib/components/CardTable.svelte';
	import CardLoading from '$lib/components/CardLoading.svelte';

	export let data: PageData & { game: Partial<Game>; cards: Card[]; category: Category };

	const gameId = $page.params.gameId;
	let cards: Card[] = data.cards || [];
	let loadingCards: boolean = true;
	let numberOfCards = 10;
	let error: string | null = null;

	async function generateCards() {
		try {
			loadingCards = true;
			console.log('Generating cards...');
			const response = await fetch(data.category.api_route, {
				method: 'POST',
				body: JSON.stringify({
					gameId,
					categoryId: data.game.category_id,
					difficulty: data.game.difficulty,
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
			loadingCards = false;
		} catch (error) {
			console.error('Error:', (error as Error).message);
			loadingCards = false;
		}
	}

	function handleCardInsert(payload: { new: any }) {
		const newCard = payload.new;
		cards = [...cards, newCard];
	}

	onMount(() => {
		const subscription = supabase
			.channel(gameId)
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'Card', filter: `game_id=eq.${gameId}` },
				handleCardInsert
			)
			.subscribe();

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<main class="flex flex-col items-center gap-10">
	<div>
		<CardTable category={data.category} cards={cards} />
	</div>

</main>
