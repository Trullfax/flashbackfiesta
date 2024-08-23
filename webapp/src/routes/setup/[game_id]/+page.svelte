<script lang="ts">
    import PlayerSelection from '$lib/components/PlayerSelection.svelte';

    function handlePlayerSelection(event: Event) {
        const { username, selectedAvatar } = (event as CustomEvent<{ username: string; selectedAvatar: string }>).detail;
        console.log('User:', username, 'Selected Avatar:', selectedAvatar);
        // Handle further logic, like navigation or API calls
    }
</script>

<main class="min-h-screen max-h-screen max-w-[1000px] flex items-center self-center">
    <PlayerSelection on:submit={handlePlayerSelection} />
</main>
