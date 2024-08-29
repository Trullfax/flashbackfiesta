<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import CardComponent from '$lib/components/CardFront.svelte';

	export let data: PageData & { game: Partial<Game>; cards: Card[]; category: Category };

	const gameId = $page.params.gameId;
	let cards: Card[] = data.cards || [];
	let numberOfCards = 10;
	let error: string | null = null;

	async function generateCards() {
		try {
			// TODO: Add loading toast here.
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

			console.log('Cards generated successfully.');
		} catch (error) {
			console.error('Error:', (error as Error).message);
		}
	}

	function handleCardInsert(payload: { new: any }) {
		console.log('New card received:', payload.new);
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

	// sort cards by year
	$: {
		cards.sort((a, b) => Number(a.year) - Number(b.year));
	}

	let tableDropZone: HTMLDivElement;

	let dropped: string[] = [];
	let status: string = '';

	let droppedIn: boolean = false;

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function handleDragStart(event: DragEvent) {
		const target = event.target as HTMLElement;
		if (target && event.dataTransfer) {
			status = 'Dragging the element ' + target.getAttribute('id');
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text', target.getAttribute('id') || '');

			target.classList.add('cursor-grabbing');
			target.classList.remove('cursor-grab');
		}
	}

	function handleDragDrop(event: DragEvent) {
		event.preventDefault();
		const cardId = event.dataTransfer?.getData('text');

		if (!cardId) return;

		const droppedElement = document.getElementById(cardId);

		if (droppedElement && tableDropZone) {
			const elements = Array.from(tableDropZone.children);
			const dropY = event.clientY;
			let insertBeforeElement = null;

			for (let element of elements) {
				const rect = element.getBoundingClientRect();
				if (dropY < rect.top + rect.height / 2) {
					insertBeforeElement = element;
					break;
				}
			}

			if (insertBeforeElement) {
				tableDropZone.insertBefore(droppedElement, insertBeforeElement);
			} else {
				tableDropZone.appendChild(droppedElement);
			}

			droppedElement.removeAttribute('draggable');
			droppedElement.classList.remove('cursor-grabbing');
			droppedElement.classList.add('cursor-default');

			dropped = [...dropped, cardId];
			droppedIn = true;
		}
	}

	function handleDragEnd(event: DragEvent) {
		const target = event.target as HTMLElement;
		if (target) {
			target.classList.remove('cursor-grabbing');
			if (!dropped.includes(target.getAttribute('id') || '')) {
				target.classList.add('cursor-grab');
			}
		}
		droppedIn = false;
	}
</script>

<main class="flex flex-col items-center gap-10">
	<h1>Category: {data.category.name}</h1>
	<div>
		<input type="number" min="1" max="100" bind:value={numberOfCards} class="p-2 border rounded" />
		<button class="mt-2 p-2 bg-blue-500 text-white rounded" on:click={generateCards}>
			Generate Cards
		</button>
	</div>

	<div
		class="w-[80%] min-h-[20rem] flex items-center gap-5 border-2 border-dashed cursor-default overflow-x-scroll"
		on:dragover={handleDragOver}
		on:drop={handleDragDrop}
		bind:this={tableDropZone}
		id="tableDropZone"
		role="button"
		tabindex="0"
		aria-label="Drop Zone"
	></div>

	{#if error}
		<p class="text-red-500">{error}</p>
	{/if}

	{#if cards.length > 0}
		<ul class="flex flex-row flex-wrap gap-5 mt-5">
			{#each cards as card}
				<li
					id={card.id}
					class="list-none cursor-grab"
					draggable="true"
					on:dragstart={handleDragStart}
					on:dragend={handleDragEnd}
				>
					<CardComponent
						title={card.name}
						subtitle={card.creator}
						imagePath={card.picture_url}
						accent_color={data.category.hex_color}
						year={Number(card.year)}
						revealed={true}
					/>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No cards to display. Click "Generate Cards" to fetch new cards.</p>
	{/if}
</main>
