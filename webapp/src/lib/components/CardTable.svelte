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

	let numberOfCards = 10;
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
			addToast({ message: 'Please select the card you want to place here first', type: 'error' });
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

	async function generateCards() {
		try {
			console.log('Generating cards...');
			const response = await fetch(category.api_route, {
				method: 'POST',
				body: JSON.stringify({
					gameId: game.id,
					categoryId: category.id,
					difficulty: game.difficulty,
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
		} catch (error) {
			console.error('Error:', (error as Error).message);
		}
	}
</script>

<Toasts />

<section class="card-table grid grid-rows-[1fr_150px] justify-items-center items-start relative">
	{#if cards.length > 0}
		<div class="flex items-center">
			<div class="scale-75">
				<ButtonArrow on:click={scrollLeft} color={category.hex_color} rotation={-90} />
			</div>
			<ul
				class="flex flex-row max-w-[80vw] min-h-[17rem] flex-nowrap mt-5 ml-10 mr-10 overflow-hidden"
				bind:this={cardListContainer}
			>
				{#each cards as card, i}
					<li
						id={card.id}
						class="list-none flex self-center relative"
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
								{:else}
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
			<div>
				<ButtonSmall text="confirm" on:click={confirmCardPlacement} />
			</div>
		{/if}
	{:else}
		<div>
			<input
				type="number"
				min="1"
				max="100"
				bind:value={numberOfCards}
				class="p-2 border rounded"
			/>
			<button class="mt-2 p-2 bg-blue-500 text-white rounded" on:click={generateCards}>
				Generate Cards
			</button>
		</div>
		<p>No cards to display. Click "Generate Cards" to fetch new cards.</p>
	{/if}
</section>
