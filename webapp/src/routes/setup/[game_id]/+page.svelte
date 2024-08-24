<script lang="ts">
    import PlayerSelection from '$lib/components/PlayerSelection.svelte';

    function handlePlayerSubmit(event: Event) {
        const { username, selectedAvatar } = (event as CustomEvent<{ username: string; selectedAvatar: string }>).detail;
        console.log('User:', username, 'Selected Avatar:', selectedAvatar);
        // Handle further logic, like navigation or API calls
    }
</script>

<main class="max-w-[1280px] flex items-center self-center">
    <PlayerSelection on:submit={handlePlayerSubmit} />
</main>
