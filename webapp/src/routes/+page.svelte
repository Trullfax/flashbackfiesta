<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { addToast } from '$lib/stores/toastStore';

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

	async function createGameAndNavigate(categoryId: string) {
		const response = await fetch('/api/create-game/', {
			method: 'POST',
			body: JSON.stringify({ categoryId }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const { gameId, error } = await response.json();

		if (error) {
			addToast({ message: error, type: 'error' });
			return;
		} else if (!gameId) {
			addToast({ message: 'game could not created', type: 'error' });
			return;
		}

		goto('/setup/' + gameId);
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
