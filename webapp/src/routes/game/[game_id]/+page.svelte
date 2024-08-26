<script lang="ts">
    import type { PageData } from './$types';
	import Card from '$lib/components/CardFront.svelte';
	import { onMount } from 'svelte';


    export let data: PageData;

    const { filteredQueryData } = data;

</script>

<main class="flex flex-col items-center gap-10">
	{#if filteredQueryData && filteredQueryData.length > 0}
		<ul class="grid grid-cols-3 gap-5">
			{#each filteredQueryData as result}
				<li>
					<Card
						title={result.itemLabel.value}
						subtitle={result.creator.value}
						imagePath={result.imageUrl ?? ''}
						accent_color="var(--ff-red)"
						year={Number(result.year.value)}
						revealed={true}
					/>
				</li>
			{/each}
		</ul>
	{:else}
		<p>Loading...</p>
	{/if}
</main>
