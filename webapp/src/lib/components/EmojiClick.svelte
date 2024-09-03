<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { fade } from 'svelte/transition';

	export let myPlayer: Player | null = null;
	let showEmoji: boolean = false;
	let clickedEmojiPlayerName: String | null = null;

	// Join the Realtime channel (adjust channel name as needed)
	const channel = supabase.channel('emoji-channel');

	// Listen for broadcasted emoji events
	channel
		.on('broadcast', { event: 'showEmoji' }, (broadcast) => {
			const playerName = broadcast.payload.playerName || 'Unknown Player';
			triggerEmoji(playerName);
		})
		.subscribe();

	function triggerEmoji(playerName: string) {
		clickedEmojiPlayerName = playerName;
		showEmoji = true;
		setTimeout(() => {
			showEmoji = false;
		}, 1000);
	}

	// Function to broadcast the emoji event
	async function handleEmojiClick() {
		if (myPlayer) {
			triggerEmoji(myPlayer.name);
			await channel.send({
				type: 'broadcast',
				event: 'showEmoji',
				payload: { playerName: myPlayer.name }
			});
		}
	}
</script>

<div class="emoji-button absolute bottom-10 right-10 z-30">
	<button
		class="w-12 h-12 text-[2rem] flex justify-center items-center bg-purple drop-shadow-subtitle rounded-full"
		on:click={handleEmojiClick}
	>
		👏
	</button>
</div>
{#if showEmoji}
	<div
		class="flex items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
		transition:fade={{ duration: 400 }}
	>
		<p class="player-name text-[2rem] font-contrail pr-5 text-center">
			👏👏👏<br />
			applause from {clickedEmojiPlayerName}
		</p>
	</div>
{/if}
