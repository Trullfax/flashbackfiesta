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
		<CardTable game={data.game} category={data.category} cards={cards} />
	</div>

</main>
