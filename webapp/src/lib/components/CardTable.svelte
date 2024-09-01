<script lang="ts">
	import CardFront from '$lib/components/CardFront.svelte';
	import ButtonShort from '$lib/components/ButtonShort.svelte';
	import Title from '$lib/components/Title.svelte';
	import ButtonArrow from './ButtonArrow.svelte';

	export let category: Category;
	export let cards: Card[];

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
        const randomAngle = (Math.random() * 5) - 2.5;
        return `rotate(${randomAngle}deg)`;
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
							<ButtonShort text="place here" accentColor={category.hex_color} />
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
						<ButtonShort text="place here" accentColor={category.hex_color} />
					</div>
				{/each}
			</ul>

			<ButtonArrow on:click={scrollRight} color={category.hex_color} rotation={90} />
		</div>
	{:else}
		<p>No cards to display. Click "Generate Cards" to fetch new cards.</p>
	{/if}
    <section>
        <img src={category.picture_path} alt={category.name}>
    </section>
</section>
