<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let myPlayer: Player | null = null;
	export let gameId: string;
	let showEmoji: boolean = false;
	let clickedEmojiPlayerName: String | null = null;

	let channel = supabase.channel('emoji' + gameId);

	onMount(() => {
		channel
			.on('broadcast', { event: 'showEmoji' }, (broadcast) => {
				const playerName = broadcast.payload.playerName || 'Unknown Player';
				triggerEmoji(playerName);
			})
			.subscribe();
		return () => {
			channel.unsubscribe();
		};
	});

	function triggerEmoji(playerName: string) {
		clickedEmojiPlayerName = playerName;
		showEmoji = true;
		setTimeout(() => {
			showEmoji = false;
		}, 1000);
	}

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

<div class="emoji-button fixed bottom-5 right-5 md:bottom-10 md:right-10 z-50">
	<button
		class="w-12 h-12 text-[2rem] flex justify-center items-center bg-purple drop-shadow-subtitle rounded-full"
		on:click={handleEmojiClick}
	>
		👏
	</button>
</div>
{#if showEmoji}
	<div
		class="flex items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
		transition:fade={{ duration: 400 }}
	>
		<p class="player-name text-[2rem] font-contrail pr-5 text-center">
			👏👏👏<br />
			applause from {clickedEmojiPlayerName}
		</p>
	</div>
{/if}
