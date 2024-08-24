<script lang="ts">
	import Start from '$lib/components/Start.svelte';
	import CategorySelection from '$lib/components/CategorySelection.svelte';

	import { selectedCategory } from '$lib/stores/gameStore';

	// Example Array - TODO: Load Categories from Database
	let categories: { name: string; picture_path: string }[] = [
		{ name: 'Movies', picture_path: 'assets/categories/movie-card.svg' },
		{ name: 'Videogames', picture_path: 'assets/categories/game-card.svg' },
		{ name: 'Music', picture_path: 'assets/categories/music-card.svg' },
		{ name: 'TV Shows', picture_path: 'assets/categories/tv-card.svg' }
	];

	function handleSelection() {
		console.log('Category Selected:' + $selectedCategory);

		//Handle futher logic like navigation or API calls
	}
</script>

<main class="flex flex-col">
	<Start />
	<CategorySelection {categories} on:click={handleSelection} />
</main>
