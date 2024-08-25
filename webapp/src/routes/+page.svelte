<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	import Start from '$lib/components/Start.svelte';
	import CategorySelection from '$lib/components/CategorySelection.svelte';

	export let data: PageData;

	function scrollToCategorySelection() {
		document.getElementById('category-section')?.scrollIntoView({ behavior: 'smooth' });
	}

	function handleCategorySubmit(event: Event) {
		const { selectedCategory } = (event as CustomEvent<{ selectedCategory: Partial<Category> }>)
			.detail;

		createGameAndNavigate(selectedCategory.id ?? '');
	}

	async function createGameAndNavigate(category_id: string) {
		const response = await fetch('/', {
			method: 'POST',
			body: JSON.stringify({ category_id }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		goto('/setup/' + (await response.json()).game_id);
	}
</script>

<main class="overflow-hidden">
	<section class="h-screen flex items-center justify-center">
		<Start on:click={scrollToCategorySelection} />
	</section>
	<section id="category-section" class="h-screen flex items-center justify-center">
		<CategorySelection categories={data.categories} on:submit={handleCategorySubmit} />
	</section>
</main>
