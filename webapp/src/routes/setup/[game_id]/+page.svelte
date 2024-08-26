<script lang="ts">
	import PlayerSelection from '$lib/components/PlayerSelection.svelte';
	import PlayerLobby from '$lib/components/PlayerLobby.svelte';

	// Example Array - TODO: Load Categories from Database
	let playerArray: Player[] = [
		{
			id: '1',
			name: 'Trullfax11',
			avatar_path: '/assets/avatars/pou_1.svg',
			is_ready: false,
			cards_count: 0,
			game_id: '1'
		},
		{
			id: '2',
			name: 'Trullfax22',
			avatar_path: '/assets/avatars/pou_2.svg',
			is_ready: false,
			cards_count: 0,
			game_id: '1'
		},
		{
			id: '3',
			name: 'Trullfax33fsdfsdfsdf',
			avatar_path: '/assets/avatars/pou_3.svg',
			is_ready: false,
			cards_count: 0,
			game_id: '1'
		},
		{
			id: '4',
			name: 'Trullfax44',
			avatar_path: '/assets/avatars/pou_4.svg',
			is_ready: false,
			cards_count: 0,
			game_id: '1'
		}
	];

	function handlePlayerSubmit(event: Event) {
		const { username, selectedAvatar } = (
			event as CustomEvent<{ username: string; selectedAvatar: string }>
		).detail;
		console.log('User:', username, 'Selected Avatar:', selectedAvatar);
		// Handle further logic, like navigation or API calls
	}
</script>

<main class="max-w-[1280px] flex flex-col items-center self-center">
	<PlayerSelection on:submit={handlePlayerSubmit} />
	<PlayerLobby {playerArray} />
</main>
