<script lang="ts">
	import PlayerDeck from '$lib/components/PlayerDeck.svelte';
	import CardFront from '$lib/components/CardFront.svelte';
	import { createEventDispatcher } from 'svelte';

	export let myPlayer: Player;
	export let turn: boolean;
	export let category: Category;
	export let cards: Card[];

	let selectedCardId: string | null = null;

	function getRandomRotation(): string {
		const randomAngle = Math.random() * 5 - 2.5;
		return `rotate(${randomAngle}deg)`;
	}

	const dispatch = createEventDispatcher();

	function handleCardSelection(cardId: string) {
		selectedCardId = cardId;
		const myCardSelection = cards.find((card) => card.id === selectedCardId);
		dispatch('submitcard', { myCardSelection });
	}
</script>

<section class="grid grid-cols-[1fr_2fr] items-center justify-items-center">
	<PlayerDeck player={myPlayer} {turn} {category} />

	<ul class="flex gap-3 flex-wrap">
		{#each cards as card}
			<button on:click={() => handleCardSelection(card.id)}>
				<li
					id={card.id}
					class="list-none self-center transition-all duration-300 ease-in-out"
					style="transform: {getRandomRotation()}; 
						{selectedCardId === card.id
						? 'transform: scale(1.5) translateZ(0); z-index: 10; margin-left: 2rem; margin-right: 2rem;'
						: ''}
					"
				>
					<CardFront
						title={card.name}
						subtitle={card.creator}
						imagePath={card.picture_url}
						accentColor={category.hex_color}
						year={Number(card.year)}
						revealed={false}
						size="small"
					/>
				</li>
			</button>
		{/each}
	</ul>
</section>
