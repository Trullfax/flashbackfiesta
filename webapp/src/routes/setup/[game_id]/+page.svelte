<script lang="ts">
	import type { PageData } from './$types';

	import PlayerSelection from '$lib/components/PlayerSelection.svelte';
	import PlayerLobby from '$lib/components/PlayerLobby.svelte';

	export let data: PageData;

	function handlePlayerSubmit(event: Event) {
		const { username, selectedAvatar } = (
			event as CustomEvent<{ username: string; selectedAvatar: string }>
		).detail;
		console.log('User:', username, 'Selected Avatar:', selectedAvatar);
		// Handle further logic, like navigation or API calls
	}
</script>

<main class="overflow-hidden">
	<section class="h-screen flex items-center justify-center">
		<PlayerSelection on:submit={handlePlayerSubmit} category={data.category} />
	</section>
	<section id="category-section" class="h-screen flex items-center justify-center">
		<PlayerLobby />
	</section>
</main>
