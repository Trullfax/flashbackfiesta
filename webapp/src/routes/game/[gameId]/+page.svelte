<script lang="ts">
    import type { PageData } from './$types';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import CardComponent from '$lib/components/CardFront.svelte';

    export let data: PageData & { game: Partial<Game>, cards: Card[], categoryApiRoute: string };

    const gameId = $page.params.gameId; // Accessing gameId from page parameters
    let cards: Card[] = data.cards || [];
    let numberOfCards = 10;
    let error: string | null = null;

    // Function to generate cards
    async function generateCards() {
        try {
            const response = await fetch(data.categoryApiRoute, {
                method: 'POST',
                body: JSON.stringify({
                    gameId,
                    categoryId: data.game.category_id,
                    difficulty: data.game.difficulty,
                    numberOfCards
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to generate cards');
            }
        } catch (error) {
            error = (error as Error).message;
        }
    }

    // // Function to handle real-time updates
    // function handleCardInsert(payload: { new: any; }) {
    //     console.log('New card received:', payload.new);
    //     const newCard = payload.new;
    //     cards = [...cards, newCard];
    // }

    // // Subscribe to real-time updates
    // onMount(() => {
    //     const subscription = supabase
    //         .channel(gameId)
    //         .on(
    //             'postgres_changes',
    //             { event: 'INSERT', schema: 'public', table: 'Card' },
    //             handleCardInsert
    //         )
    //         .subscribe();

    //     // Cleanup on component unmount
    //     return () => {
    //         subscription.unsubscribe();
    //     };
    // });
</script>

<main class="flex flex-col items-center gap-10">
    <h1>Game Cards</h1>

    <div>
        <input
            type="number"
            min="1"
            max="100"
            bind:value={numberOfCards}
            class="p-2 border rounded"
        />
        <button
            class="mt-2 p-2 bg-blue-500 text-white rounded"
            on:click={generateCards}
        >
            Generate Cards
        </button>
    </div>

    {#if error}
        <p class="text-red-500">{error}</p>
    {/if}

    {#if cards.length > 0}
        <ul class="grid grid-cols-3 gap-5 mt-5">
            {#each cards as card}
                <li>
                    <CardComponent
                        title={card.name}
                        subtitle={card.creator}
                        imagePath={card.picture_url}
                        accent_color="var(--ff-red)"
                        year={Number(card.year)}
                        revealed={true}
                    />
                </li>
            {/each}
        </ul>
    {:else}
        <p>No cards to display. Click "Generate Cards" to fetch new cards.</p>
    {/if}
</main>
