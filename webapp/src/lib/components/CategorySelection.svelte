<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	import ButtonSmall from '$lib/components/ButtonSmall.svelte';
	import Title from '$lib/components/Title.svelte';

	export let categories: Category[] = [];

	let selectedCategory = writable<string | null>(null);

	function selectCategory(category: string) {
		selectedCategory.set(category);
	}
</script>

<div class="flex flex-col items-center">
	<div class="w-[62rem] flex justify-start">
		<Title title="CATEGORY" subtitle="choose a category" flip={true} />
	</div>
	<div class="h-[17rem] flex flex-row gap-7">
		{#if categories && categories.length > 0}
			{#each categories as category}
				<div class="flex flex-col items-center gap-6">
					<button on:click={() => selectCategory(category.name)} class="w-[10rem] drop-shadow-bold">
						<img
							src={category.picture_path}
							alt="categorycard for {category.name}"
							class="w-[10rem] {$selectedCategory === category.name
								? '-translate-y-6 transition-all'
								: ''}"
						/>
					</button>
					<p
						class="font-contrail text-white drop-shadow-[3px_2px_0_#1d1e1d] {$selectedCategory ===
						category.name
							? 'text-3xl transition-all'
							: 'text-2xl '}"
					>
						{category.name}
					</p>
				</div>
			{/each}
		{:else}
			<p>No Categories found!</p>
		{/if}
	</div>
	<div class="mt-8">
		<ButtonSmall text="LET'S PLAY" accent_color="#ff847c" on:click />
	</div>
</div>
