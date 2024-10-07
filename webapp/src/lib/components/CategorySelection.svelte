<script lang="ts">
	import ButtonSmall from '$lib/components/ButtonSmall.svelte';
	import Title from '$lib/components/Title.svelte';
	import Toasts from '$lib/components/alert/Toasts.svelte';
	import { addToast } from '$lib/stores/toastStore';
	import { createEventDispatcher } from 'svelte';

	export let categories: Partial<Category>[] = [];
	export let selectedCategory: Partial<Category> = {};

	function selectCategory(category: Partial<Category>) {
		selectedCategory = category;
	}

	const dispatch = createEventDispatcher();
	function handleCategorySelection() {
		if (!selectedCategory || !selectedCategory.name) {
			addToast({ message: 'please choose a category', type: 'error' });
			return;
		}
		dispatch('submit', { selectedCategory });
	}
</script>

<Toasts />

<div class="grid justify-items-center md:w-[60vw] md:-translate-y-[5vh]">
	<div class="justify-self-start scale-[70%] md:scale-[100%]">
		<Title title="CATEGORY" subtitle="choose a category" flip={true} />
	</div>

	<div class="h-[17rem] flex flex-row gap-4 md:gap-7">
		{#if categories && categories.length > 0}
			{#each categories as category}
				<div class="grid justify-items-center gap-6">
					<button
						on:click={() => selectCategory(category)}
						class="w-[8rem] md:w-[10rem] drop-shadow-bold"
					>
						<img
							src={category.picture_path}
							alt="categorycard for {category.name}"
							class="transition-all {selectedCategory.name === category.name
								? '-translate-y-6'
								: ''}"
						/>
					</button>
					<p
						class="font-contrail text-white drop-shadow-[3px_2px_0_#1d1e1d] transition-all {selectedCategory.name ===
						category.name
							? 'text-3xl'
							: 'text-2xl'}"
					>
						{category.name}
					</p>
				</div>
			{/each}
		{:else}
			<h3 class="font-contrail text-white col-span-full">no categories found!</h3>
		{/if}
	</div>
	<div class="mt-12 md:mt-8">
		<ButtonSmall
			text="LET'S PLAY"
			accent_color="var(--ff-green)"
			on:click={handleCategorySelection}
		/>
	</div>
</div>
