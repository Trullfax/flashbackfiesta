<script lang="ts">
	import CardFront from '$lib/components/CardFront.svelte';
	import ButtonPlaceCard from '$lib/components/ButtonPlaceCard.svelte';
	import Title from '$lib/components/Title.svelte';
	import ButtonArrow from './ButtonArrow.svelte';

	export let category: Category;
	export let cards: Card[];
	export let game: Partial<Game>;

	let numberOfCards = 10;

	let cardListContainer: HTMLUListElement;

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

	async function generateCards() {
		try {
			console.log('Generating cards...');
			const response = await fetch(category.api_route, {
				method: 'POST',
				body: JSON.stringify({
					gameId: game.id,
					categoryId: game.category_id,
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

<section class="card-table flex flex-col items-center relative">
	<Title title={category.name ?? ''} subtitle={`place your cards`} flip={false} />
	{#if cards.length > 0}
		<div class="flex gap-5 items-center">
			<ButtonArrow on:click={scrollLeft} color={category.hex_color} rotation={-90} />

			<ul
				class="flex flex-row max-w-[80vw] min-h-[17rem] flex-nowrap mt-5 ml-10 mr-10 overflow-hidden"
				bind:this={cardListContainer}
			>
				{#each cards as card, i}
					{#if i === 0}
						<div class="self-center">
							<ButtonPlaceCard text="place here" accentColor={category.hex_color} />
						</div>
					{/if}
					<li id={card.id} class="list-none self-center" style="transform: {getRandomRotation()};">
						<CardFront
							title={card.name}
							subtitle={card.creator}
							imagePath={card.picture_url}
							accentColor={category.hex_color}
							year={Number(card.year)}
							revealed={card.in_deck}
						/>
					</li>
					<div class="self-center">
						<ButtonPlaceCard text="place here" accentColor={category.hex_color} />
					</div>
				{/each}
			</ul>

			<ButtonArrow on:click={scrollRight} color={category.hex_color} rotation={90} />
		</div>
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
	<section>
		<img src={category.picture_path} alt={category.name} />
	</section>
</section>
