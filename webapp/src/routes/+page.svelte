<script lang="ts">
	import Start from '$lib/components/Start.svelte';
	import CategorySelection from '$lib/components/CategorySelection.svelte';
	
	// Example Array - TODO: Load Categories from Database
	let categories: Category[] = [
		{ id: '1', name: 'Movies', picture_path: 'assets/categories/movie-card.svg', api_route: '/movies', hex_color: 'var(--ff-red)' },
		{ id: '2', name: 'Videogames', picture_path: 'assets/categories/game-card.svg', api_route: '/games', hex_color: 'var(--ff-purple)' },
		{ id: '3', name: 'Music', picture_path: 'assets/categories/music-card.svg', api_route: '/music', hex_color: 'var(--ff-blue)' },
		{ id: '4', name: 'TV Shows', picture_path: 'assets/categories/tv-card.svg', api_route: '/tv', hex_color: 'var(--ff-green)' }
	];

	function handleCategorySubmit(event: Event) {
        const { selectedCategory } = (event as CustomEvent<{ selectedCategory: string }>).detail;
        console.log('Selected Category:', selectedCategory);
        // Handle further logic, like navigation or API calls
    }
</script>

<main class="flex flex-col">
	<Start />
	<CategorySelection {categories} on:submit={handleCategorySubmit} />
</main>
