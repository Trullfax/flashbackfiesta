<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let myPlayer: Player | null = null;
	export let gameId: string;
	export let className: string = '';

	let showEmoji: boolean = false;
	let clickedEmojiPlayerName: String | null = null;

	let channel = supabase.channel(`emoji:${gameId}`);

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

<div class="emoji-button {className}">
	<button
		class="w-12 h-12 text-[2rem] flex justify-center items-center bg-purple drop-shadow-subtitle rounded-full"
		on:click={handleEmojiClick}
	>
		👏
	</button>
</div>
{#if showEmoji}
	<div
		class="flex items-center fixed top-0 justify-center pointer-events-none left-0 z-50 w-full h-[100dvh]"
		transition:fade={{ duration: 400 }}
	>
		<p class="player-name text-[2rem] font-contrail pr-5 text-center">
			👏👏👏<br />
			applause from {clickedEmojiPlayerName}
		</p>
	</div>
{/if}
