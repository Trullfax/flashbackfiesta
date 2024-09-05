<script lang="ts">
	import ButtonBig from '$lib/components/ButtonBig.svelte';
	import Title from '$lib/components/Title.svelte';
	import { Copy } from 'lucide-svelte';
	import { page } from '$app/stores';
	import LoadingBar from './LoadingBar.svelte';

	export let playerArray: Partial<Player>[] = [];
	export let isCreator: boolean;
	export let settingUp: boolean;

	let currentUrl = '';

	// Subscribe to the page store to get the current URL
	$: {
		currentUrl = $page.url.href;
	}

	// Ensure that the creator is always the first player in the array
	$: {
		if (playerArray && playerArray.length > 0) {
			const creatorIndex = playerArray.findIndex((player) => player?.is_creator);
			if (creatorIndex > 0) {
				// Move the creator to the first position
				const [creator] = playerArray.splice(creatorIndex, 1);
				playerArray.unshift(creator);
			}
		}
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

<div class="grid justify-items-center items-center gap-6 grid-rows-4">
	<div class="flex flex-col items-center gap-4 row-span-3 max-w-full">
		<Title title="YOUR FIESTA" subtitle="invite your friends" flip={true} />
		<div
			class="h-[7rem] sm:h-[10rem] p-5 gap-7 sm:gap-5 -translate-y-[1.5rem] grid"
			style={`grid-template-columns: repeat(${playerArray.length}, 1fr);`}
		>
			{#if playerArray && playerArray.length > 0}
				{#each { length: playerArray.length } as _, index}
					<div
						class="flex flex-col items-center gap-3 sm:gap-5"
					>
						<div
							class="bg-grey drop-shadow-title
							{index % 2 === 0 ? '-rotate-[3.5deg]' : 'rotate-[2.5deg]'} 
							{playerArray[index].is_creator
								? 'max-w-[6.5rem] max-h-[6.5rem]'
								: 'max-w-[5rem] max-h-[5rem]'}
								{settingUp ? 'animate-bounce' : ''}"
						>
							<img
								src={playerArray[index].avatar_path}
								alt="Avatar of Player {playerArray[index].name}"
							/>
						</div>
						<div>
							{#if playerArray[index]}
								<p
									class="sm:w-[8rem] drop-shadow-simple-text font-contrail text-center text-white text-clip overflow-hidden break-words {index ===
									0
										? 'text-[1rem]'
										: 'text-[.75rem]'}"
								>
									{playerArray[index].name}
								</p>
							{/if}
						</div>
					</div>
				{/each}
			{:else}
				<h3 class="font-contrail text-white col-span-full">no players found!</h3>
			{/if}
		</div>
		<label for="gamelink">
			<div class="flex flex-row gap-4">
				<input
					type="text"
					value={currentUrl}
					name="gamelink"
					class="font-contrail text-[.7rem] sm:text-sm w-[15rem] sm:w-[20rem] p-1 sm:p-2 drop-shadow-bold z-10 focus-visible:outline-none"
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
	</div>
	<div class="flex row-span-1">
		{#if settingUp}
			<div class="flex flex-col items-center gap-5 mt-5">
				<span class="cardshuffle"></span>
				<p class="text-white font-contrail text-lg mt-4">setting up game...</p>
			</div>
		{:else}
			<div>
				{#if isCreator}
					<ButtonBig text="LET'S PLAY" on:click />
				{:else}
					<LoadingBar />
					<p class="text-white font-contrail text-lg mt-4">
						waiting for the host to start the fiesta...
					</p>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.cardshuffle {
		position: relative;
		display: flex;
	}
	.cardshuffle:before,
	.cardshuffle:after {
		content: '';
		width: 30px;
		height: 40px;
		display: inline-block;
		position: relative;
		margin: 0 10px;
		border-radius: 2px;
		color: var(--ff-purple);
		filter: drop-shadow(5px 4px 0px #1d1e1d);
		background: currentColor;
		box-shadow:
			100px 0,
			-100px 0;
		animation: left 1s infinite ease-in-out;
	}
	.cardshuffle:after {
		color: var(--ff-purple);
		animation: right 1.1s infinite ease-in-out;
	}

	@keyframes right {
		0%,
		100% {
			transform: translateY(-10px);
		}
		50% {
			transform: translateY(10px);
		}
	}

	@keyframes left {
		0%,
		100% {
			transform: translateY(10px);
		}
		50% {
			transform: translateY(-10px);
		}
	}
</style>
