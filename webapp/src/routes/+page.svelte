<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { addToast } from '$lib/stores/toastStore';
	import { onMount } from 'svelte';
	import Start from '$lib/components/Start.svelte';
	import CategorySelection from '$lib/components/CategorySelection.svelte';
	import Background from '$lib/components/Background.svelte';

	let pageTitle = 'Start your fiesta · Flashbackfiesta';

	let startSection: HTMLElement;
	let categorySection: HTMLElement;

	export let data: PageData;

	onMount(() => {
		startSection?.scrollIntoView({ behavior: 'smooth' });
	});

	function scrollToCategorySelection() {
		categorySection?.scrollIntoView({ behavior: 'smooth' });
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
	<meta
		name="description"
		content="Dive into the ultimate pop culture challenge with Flashback Fiesta!"
	/>
</svelte:head>

<main class="relative overflow-hidden">
	<Background />
	<section
		bind:this={startSection}
		class="h-screen relative z-50 flex items-center justify-center p-6"
	>
		<Start on:click={scrollToCategorySelection} />
		<div class="absolute bottom-0 flex justify-center items-center h-5 w-screen p-4 bg-purple">
			<a class="font-contrail text-[.7rem] sm:text-l text-white" href="/imprint"
				>made with ♥ by Anna-Lena Langhans and Tjalf-Bjarne Scharnweber</a
			>
		</div>
	</section>
	<section
		bind:this={categorySection}
		class="h-screen flex relative z-50 justify-center items-center p-6"
	>
		<CategorySelection categories={data.categories} on:submit={handleCategorySubmit} />
	</section>
</main>
