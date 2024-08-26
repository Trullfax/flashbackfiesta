<script lang="ts">
	import ButtonBig from '$lib/components/ButtonBig.svelte';
	import Title from '$lib/components/Title.svelte';
	import { Copy } from 'lucide-svelte';
	import { page } from '$app/stores';

	export let playerArray: Player[] = [];

	let currentUrl = '';

	// Subscribe to the page store to get the current URL
	$: {
		currentUrl = $page.url.href;
	}

	// Function to copy the current URL to the clipboard
	function copyToClipboard() {
		navigator.clipboard
			.writeText(currentUrl)
			.then(() => {
				console.log('URL copied to clipboard');
			})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	}
</script>

<div class="flex flex-col items-center gap-4">
	<Title title="YOUR FIESTA" subtitle="invite your competitors" flip={true} />
	<div class="h-[7rem] flex flex-row items-center gap-6 -translate-y-[1.5rem]">
		{#if playerArray && playerArray.length > 0}
			{#each { length: playerArray.length } as _, index}
				<div class="flex flex-col items-center gap-5">
					<div
						class=" bg-grey drop-shadow-bold {index % 2 === 0
							? '-rotate-[3.5deg]'
							: 'rotate-[2.5deg]'} {index === 0 ? 'w-[6.5rem] h-[6.5rem]' : 'w-[5rem] h-[5rem]'}"
					>
						<img
							src={playerArray[index].avatar_path}
							alt="Avatar of Player {playerArray[index].name}"
						/>
					</div>
					<div>
						{#if playerArray[index]}
							<p
								class="w-[6rem] font-contrail text-center text-white text-clip overflow-hidden {index ===
								0
									? 'text-[1.25rem]'
									: 'text-[1rem]'}"
							>
								{playerArray[index].name}
							</p>
						{/if}
					</div>
				</div>
			{/each}
		{:else}
			<p>No Players found!</p>
		{/if}
	</div>
	<label for="gamelink">
		<div class="flex flex-row gap-4">
			<input
				type="text"
				value={currentUrl}
				name="gamelink"
				class="font-contrail w-[20rem] p-2 drop-shadow-bold z-10 focus-visible:outline-none"
				readonly
			/>
			<div class="group">
				<button
					class="w-[2.5rem] h-[2.5rem] drop-shadow-bold bg-white flex justify-center items-center group-hover:bg-purple transition-all"
					on:click={copyToClipboard}
					><Copy strokeWidth={3.5} class="group-hover:text-white transition-all" />
				</button>
			</div>
		</div>
	</label>
	<ButtonBig text="LET'S PLAY" on:click />
</div>
