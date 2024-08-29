<script lang="ts">
    import type { PageData } from './$types';
    import Card from '$lib/components/CardFront.svelte';

    export let data: PageData & { cards: Card[] };
</script>

<main class="flex flex-col items-center gap-10">
    {#if data.cards && data.cards.length > 0}
        <ul class="grid grid-cols-3 gap-5">
            {#each data.cards as result}
                <li>
                    <Card
                        title={result.name}
                        subtitle={result.creator}
                        imagePath={result.picture_url}
                        accent_color="var(--ff-red)"
                        year={Number(result.year)}
                        revealed={true}
                    />
                </li>
            {/each}
        </ul>
    {:else}
        <p>Loading...</p>
    {/if}
</main>
