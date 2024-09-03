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
			addToast({ message: 'Please select the card you want to place here first!', type: 'error' });
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

<section class="card-table grid grid-rows-[1fr_200px] justify-items-center items-center relative">
	{#if cards.length > 0}
		<div class="flex items-center justify-center">
			<div class="scale-75">
				<ButtonArrow on:click={scrollLeft} color={category.hex_color} rotation={-90} />
			</div>
			<ul
				class="flex w-[70vw] min-h-min pt-5 pb-5 flex-nowrap ml-10 mr-10 overflow-hidden transition-all duration-300"
				bind:this={cardListContainer}
			>
				{#each cards as card, i}
					<li
						id={card.id}
						class="list-none flex self-center relative transition-all"
						style="transform: {getRandomRotation()};"
					>
						{#if i === 0 && game.whose_turn_id === player?.id}
							<div class="self-center">
								{#if selectedCard && temporarilyPlacedCardIndex === i}
									<div class="animate-pulse transition-all">
										<CardFront
											title={selectedCard.name}
											subtitle={selectedCard.creator}
											imagePath={selectedCard.picture_url}
											accentColor={category.hex_color}
											year={Number(selectedCard.year)}
											revealed={selectedCard.played}
										/>
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
						<div class="scale-75">
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
									<div class="animate-pulse transition-all">
										<CardFront
											title={selectedCard.name}
											subtitle={selectedCard.creator}
											imagePath={selectedCard.picture_url}
											accentColor={category.hex_color}
											year={Number(selectedCard.year)}
											revealed={selectedCard.played}
										/>
									</div>
								{:else if (cards.length < 2 || i === (cards.length - 1) ||((Number(cards[i].year) + 1) !== (Number(cards[i + 1].year))))}
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
			<div class="scale-75">
				<ButtonArrow on:click={scrollRight} color={category.hex_color} rotation={90} />
			</div>
		</div>
		{#if temporarilyPlacedCardIndex !== null}
			<div class="self-start">
				<ButtonSmall text="confirm" on:click={confirmCardPlacement} />
			</div>
		{/if}
	{:else}
		<p class="font-contrail">No cards to display.</p>
	{/if}
</section>
