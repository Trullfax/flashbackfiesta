<script lang="ts">
	import type { PageData } from './$types';

	import Start from '$lib/components/Start.svelte';
	import CategorySelection from '$lib/components/CategorySelection.svelte';

	export let data: PageData;
	console.log(data);

	function scrollToCategorySelection() {
		document.getElementById('category-section')?.scrollIntoView({ behavior: 'smooth' });
	}

	function handleCategorySubmit(event: Event) {
		const { selectedCategory } = (event as CustomEvent<{ selectedCategory: string }>).detail;
		console.log('Selected Category:', selectedCategory);
		// Handle further logic, like navigation or API calls
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
