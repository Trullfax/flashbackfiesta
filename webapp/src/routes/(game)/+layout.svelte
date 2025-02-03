<script lang='ts'>
    import { onMount } from "svelte";
    import { joinPresence, unsubscribePresence, myPlayer, currentGame } from "$lib/stores/playerTracking.store";

    onMount(() => {
		if ($myPlayer && $currentGame) {
            joinPresence($currentGame);
        }

		return () => {
			unsubscribePresence();
		};
	});
</script>

<slot/>