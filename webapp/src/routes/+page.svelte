<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { addToast } from '$lib/stores/toastStore';
	import { onMount } from 'svelte';
	import Start from '$lib/components/Start.svelte';
	import CategorySelection from '$lib/components/CategorySelection.svelte';
	import StartpageBackground from '$lib/components/StartpageBackground.svelte';

	let pageTitle = 'Start your fiesta · Flashbackfiesta';

	export let data: PageData;

	onMount(() => {
		document.getElementById('start-section')?.scrollIntoView({ behavior: 'smooth' });
	});

	function scrollToCategorySelection() {
		document.getElementById('category-section')?.scrollIntoView({ behavior: 'smooth' });
		pageTitle = 'Choose a category · Flashbackfiesta';
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

		const { status, gameId, creatorCode, error } = await response.json();

		if (status === 'error') {
			addToast({ message: error, type: 'error' });
			return;
		}

		localStorage.setItem('creatorCode', creatorCode);

		goto('/setup/' + gameId);
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<main class="relative overflow-hidden">
	<StartpageBackground />
	<section id="start-section" class="h-screen relative z-10 flex items-center justify-center">
		<Start on:click={scrollToCategorySelection} />
	</section>
	<section id="category-section" class="h-screen flex items-center justify-center">
		<CategorySelection categories={data.categories} on:submit={handleCategorySubmit} />
	</section>
</main>
