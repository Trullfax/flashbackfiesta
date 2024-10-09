<script lang="ts">
	import ButtonBig from '$lib/components/ButtonBig.svelte';
	import Title from '$lib/components/Title.svelte';
	import { Copy } from 'lucide-svelte';
	import { page } from '$app/stores';
	import LoadingBar from './LoadingBar.svelte';

	export let playerArray: Partial<Player>[] = [];

	console.log(playerArray);

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

<div
	class="grid justify-items-center items-center grid-rows-[12vh_35vh_10vh_8vh] md:grid-rows-[12vh_42vh_17vh_17vh] lg:grid-rows-[8rem_15rem_4rem_7rem]"
>
	<div class="h-[9rem] scale-[70%] lg:scale-[100%] flex items-center">
		<Title title="YOUR FIESTA" subtitle="invite your friends" flip={true} />
	</div>

	<div class="flex flex-col md:flex-row items-center gap-4 md:gap-8 translate-y-[1rem]">
		{#if playerArray && playerArray.length > 0}
			{#if playerArray[0].is_creator}
				<div
					class="flex flex-col items-center gap-3
							{settingUp ? 'animate-bounce' : ''}"
				>
					<img
						src={playerArray[0].avatar_path}
						alt="Avatar of Player {playerArray[0].name}"
						class="drop-shadow-title -rotate-[3.5deg] max-w-[6.5rem] lg:max-w-[7.5rem] max-h-[6.5rem] lg:max-h-[7.5rem]"
					/>
					<p
						class="font-contrail text-center text-white text-clip overflow-hidden break-words text-md lg:text-xl"
					>
						{playerArray[0].name}
					</p>
				</div>
			{/if}
			<div class="flex flex-row gap-8">
				{#each { length: playerArray.length } as _, index}
					{#if !playerArray[index].is_creator}
						<div
							class="flex flex-col items-center gap-3
								{settingUp ? 'animate-bounce' : ''}"
						>
							<img
								src={playerArray[index].avatar_path}
								alt="Avatar of Player {playerArray[index].name}"
								class="drop-shadow-title max-w-[5rem] lg:max-w-[6rem] max-h-[5rem] lg:max-h-[6rem]
								{index % 2 === 0 ? '-rotate-[3.5deg]' : 'rotate-[2.5deg]'}"
							/>
							<p
								class="font-contrail text-center text-white text-clip overflow-hidden break-words text-sm lg:text-lg"
							>
								{playerArray[index].name}
							</p>
						</div>
					{/if}
				{/each}
			</div>
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
				class="font-contrail text-md w-[15rem] md:w-[24rem] p-2 drop-shadow-bold z-10 focus-visible:outline-none"
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

	<div class="flex row-span-1">
		{#if settingUp}
			<div class="flex flex-col items-center gap-5 mt-5">
				<div class="scale-[80%] lg:scale-[100%]">
					<span class="cardshuffle translate-y-[1rem]"></span>
				</div>
				<p class="text-white font-contrail text-lg mt-4 lg:mt-8">setting up game...</p>
			</div>
		{:else}
			<div>
				{#if isCreator}
					<div class="scale-[80%] lg:scale-[100%]">
						<ButtonBig text="LET'S PLAY" on:click />
					</div>
				{:else}
					<div class="scale-[80%] lg:scale-[100%]">
						<LoadingBar />
					</div>
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
