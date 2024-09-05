<script lang="ts">
	import PlayerDeck from '$lib/components/PlayerDeck.svelte';
	import CardFront from '$lib/components/CardFront.svelte';
	import ButtonArrow from '$lib/components/ButtonArrow.svelte';
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

	let carouselContainer: HTMLUListElement;

	function scrollLeft() {
		carouselContainer.scrollBy({ left: -carouselContainer.offsetWidth / 2, behavior: 'smooth' });
	}

	function scrollRight() {
		carouselContainer.scrollBy({ left: carouselContainer.offsetWidth / 2, behavior: 'smooth' });
	}

	const dispatch = createEventDispatcher();

	function handleCardSelection(cardId: string) {
		selectedCardId = cardId;
		const myCardSelection = cards.find((card) => card.id === selectedCardId);
		dispatch('submitcard', { myCardSelection });
	}
</script>

<section class="grid md:grid-cols-[1fr_2fr] items-center justify-items-center relative w-[100vw] md:w-full">
	<div
		class="block md:hidden z-10 size-10 absolute bottom-5 left-5 drop-shadow-title {turn
			? 'animate-pulse'
			: ''}"
	>
		<img src={myPlayer.avatar_path} alt={'Avatar for ' + myPlayer.name} />
	</div>
	<div class="hidden md:block">
		<PlayerDeck player={myPlayer} {turn} {category} />
	</div>

	<!-- Carousel Buttons -->
	<div class="md:hidden absolute -left-5 z-10 p-2 scale-50">
		<ButtonArrow on:click={scrollLeft} color={category.hex_color} rotation={-90} />
	</div>
	<div class="md:hidden absolute -right-5 z-10 p-2 scale-50">
		<ButtonArrow on:click={scrollRight} color={category.hex_color} rotation={90} />
	</div>

	<ul
		class="flex gap-3 max-w-[80vw] md:max-w-max overflow-x-auto overflow-y-visible md:overflow-x-visible md:pt-0 md:pb-0 pt-10 pb-10 scroll-smooth"
		bind:this={carouselContainer}
	>
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
