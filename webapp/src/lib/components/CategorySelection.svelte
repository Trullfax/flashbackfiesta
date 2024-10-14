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

<div
	class="grid grid-rows-[10vh_40vh_7vh] md:grid-rows-[5rem_16rem_4rem] lg:grid-rows-[8rem_24rem_4rem] justify-items-center items-center lg:w-[50vw] lg:-translate-y-[4vh]"
>
	<div class="justify-self-start scale-[70%] lg:scale-[100%]">
		<Title title="CATEGORY" subtitle="choose a category" flip={true} />
	</div>

	<div class="flex flex-row gap-6 md:translate-y-[0.75rem] lg:translate-y-0">
		{#if categories && categories.length > 0}
			{#each categories as category}
				<div class="grid justify-items-center gap-6 md:gap-3 lg:gap-6">
					<button
						on:click={() => selectCategory(category)}
						class="w-[6.5rem] lg:w-[10rem] drop-shadow-bold"
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
							? 'text-2xl lg:text-3xl'
							: 'text-xl lg:text-2xl'}"
					>
						{category.name}
					</p>
				</div>
			{/each}
		{:else}
			<h3 class="font-contrail text-white col-span-full">no categories found!</h3>
		{/if}
	</div>
	<div>
		<ButtonSmall
			text="LET'S PLAY"
			accent_color="var(--ff-green)"
			on:click={handleCategorySelection}
		/>
	</div>
</div>
