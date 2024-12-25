<script lang="ts">
	import CardFront from '$lib/components/CardFront.svelte';
	import ButtonPlaceCard from '$lib/components/ButtonPlaceCard.svelte';
	import ButtonArrow from '$lib/components/ButtonArrow.svelte';
	import ButtonSmall from '$lib/components/ButtonSmall.svelte';
	import Toasts from '$lib/components/alert/Toasts.svelte';
	import { addToast } from '$lib/stores/toastStore';
	import { createEventDispatcher } from 'svelte';

	export let category: Category;
	export let cards: Card[];
	export let game: Game;
	export let player: Player | null;
	export let selectedCard: Card | null;

	let cardListContainer: HTMLUListElement;
	let temporarilyPlacedCardIndex: number | null = null;

	const dispatch = createEventDispatcher();

	function scrollLeft() {
		if (cardListContainer) {
			cardListContainer.scrollBy({ left: -700, behavior: 'smooth' });
		}
	}

	function scrollRight() {
		if (cardListContainer) {
			cardListContainer.scrollBy({ left: 700, behavior: 'smooth' });
		}
	}

	function getRandomRotation(): string {
		const randomAngle = Math.random() * 5 - 2.5;
		return `rotate(${randomAngle}deg)`;
	}

	function handlePlaceCard(index: number) {
		if (player && game.whose_turn_id !== player.id) {
			addToast({ message: 'It is not your turn', type: 'error' });
			return;
		}

		if (!selectedCard) {
			addToast({ message: 'Please select a card first!', type: 'error' });
			return;
		}
		temporarilyPlacedCardIndex = index;
	}

	function confirmCardPlacement() {
		if (temporarilyPlacedCardIndex !== null && selectedCard) {
			dispatch('placecard', { index: temporarilyPlacedCardIndex, myCardSelection: selectedCard });
			temporarilyPlacedCardIndex = null;
		}
	}
</script>

<Toasts />

<section
	class="card-table max-w-[80vw] grid md:grid-rows-[1fr_200px] md:grid-cols-[1fr_10fr_1fr] justify-self-center justify-items-center items-center relative"
>
	{#if cards.length > 0}
		<div class="hidden md:block scale-75">
			<ButtonArrow on:click={scrollLeft} color={category.hex_color} rotation={-90} />
		</div>
		<ul
			class="flex flex-col md:grid pr-10 pl-10 items-center min-h-min h-full md:h-auto max-w-full flex-nowrap md:overflow-hidden transition-all justify-center md:justify-normal"
			bind:this={cardListContainer}
			style={`grid-template-columns: repeat(${cards.length}, 1fr); scrollbar-width: none;`}
		>
			{#each cards as card, i}
				<li
					class="scale-50 md:scale-100 list-none flex flex-col md:flex-row self-center relative transition-all"
					style="transform: {getRandomRotation()};"
				>
					{#if i === 0 && game.whose_turn_id === player?.id}
						<div class="self-center">
							{#if selectedCard && temporarilyPlacedCardIndex === i}
								<div class="animate-pulse transition-all relative md:static">
									<CardFront
										title={selectedCard.name}
										subtitle={selectedCard.creator}
										imagePath={selectedCard.picture_url}
										accentColor={category.hex_color}
										year={Number(selectedCard.year)}
										revealed={selectedCard.played}
									/>
									{#if temporarilyPlacedCardIndex !== null}
										<div
											class="md:hidden col-span-full absolute -rotate-12 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
										>
											<ButtonPlaceCard text="confirm" on:click={confirmCardPlacement} />
										</div>
									{/if}
								</div>
							{:else}
								<ButtonPlaceCard
									text="place here"
									accentColor={category.hex_color}
									on:click={() => handlePlaceCard(i)}
								/>
							{/if}
						</div>
					{/if}
					<div id={String(card.id)} class="scale-75 transition duration-1000 ease-in-out">
						<CardFront
							title={card.name}
							subtitle={card.creator}
							imagePath={card.picture_url}
							accentColor={category.hex_color}
							year={Number(card.year)}
							revealed={card.played}
						/>
					</div>
					{#if game.whose_turn_id === player?.id}
						<div class="self-center">
							{#if selectedCard && temporarilyPlacedCardIndex === i + 1}
								<div class="animate-pulse transition-all relative md:static">
									<CardFront
										title={selectedCard.name}
										subtitle={selectedCard.creator}
										imagePath={selectedCard.picture_url}
										accentColor={category.hex_color}
										year={Number(selectedCard.year)}
										revealed={selectedCard.played}
									/>
									{#if temporarilyPlacedCardIndex !== null}
										<div
											class="md:hidden col-span-full absolute -rotate-12 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
										>
											<ButtonPlaceCard text="confirm" on:click={confirmCardPlacement} />
										</div>
									{/if}
								</div>
							{:else if cards.length < 2 || i === cards.length - 1 || Number(cards[i].year) + 1 !== Number(cards[i + 1].year)}
								<ButtonPlaceCard
									text="place here"
									accentColor={category.hex_color}
									on:click={() => handlePlaceCard(i + 1)}
								/>
							{/if}
						</div>
					{/if}
				</li>
			{/each}
		</ul>
		<div class="hidden md:block scale-75">
			<ButtonArrow on:click={scrollRight} color={category.hex_color} rotation={90} />
		</div>
		{#if temporarilyPlacedCardIndex !== null}
			<div class="hidden md:block col-span-full">
				<ButtonSmall text="confirm" on:click={confirmCardPlacement} />
			</div>
		{/if}
	{:else}
		<p class="font-contrail">No cards to display.</p>
	{/if}
</section>
