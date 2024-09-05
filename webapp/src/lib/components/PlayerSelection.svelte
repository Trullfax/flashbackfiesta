<script lang="ts">
	import ButtonSmall from '$lib/components/ButtonSmall.svelte';
	import Title from '$lib/components/Title.svelte';
	import ButtonArrow from '$lib/components/ButtonArrow.svelte';
	import Dice from '$lib/components/Dice.svelte';
	import Toasts from '$lib/components/alert/Toasts.svelte';
	import { createEventDispatcher } from 'svelte';
	import { addToast } from '$lib/stores/toastStore';

	let avatarArray: string[] = [];
	let currentAvatar = '';
	let currentIndex = 0;

	export let selectedAvatar = '';
	export let category: Partial<Category> = {};

	async function loadAvatars() {
		const avatarPaths = [
			'/assets/avatars/pou_1.svg',
			'/assets/avatars/pou_2.svg',
			'/assets/avatars/pou_3.svg',
			'/assets/avatars/pou_4.svg'
		];

		avatarArray = avatarPaths;
		currentAvatar = avatarArray[currentIndex];
		selectedAvatar = currentAvatar;
	}

	function shuffleAvatars() {
		avatarArray = avatarArray.sort(() => Math.random() - 0.5);
		currentAvatar = avatarArray[0];
		currentIndex = 0;
		selectedAvatar = currentAvatar;
	}

	function nextAvatar() {
		currentIndex = (currentIndex + 1) % avatarArray.length;
		currentAvatar = avatarArray[currentIndex];
		selectedAvatar = currentAvatar;
	}

	function prevAvatar() {
		currentIndex = (currentIndex - 1 + avatarArray.length) % avatarArray.length;
		currentAvatar = avatarArray[currentIndex];
		selectedAvatar = currentAvatar;
	}

	loadAvatars();

	let playerName = '';
	const dispatch = createEventDispatcher();

	function handlePlayerSelection() {
		// TODO: Add validation logic, like checking if the playerName already exists
		if (playerName.trim() === '') {
			addToast({ message: 'please enter a player name!', type: 'error' });
			return;
		}
		dispatch('submit', { playerName, selectedAvatar });
	}
</script>

<Toasts />

<div class="grid gap-10 lg:gap-0 lg:grid-cols-2 max-w-[75vw] justify-items-center items-center">
	<div class="grid grid-cols-3 items-center gap-5 justify-items-center">
		<ButtonArrow color="#ff847c" rotation={-80} on:click={prevAvatar} />
		<div class="relative">
			<img src={currentAvatar} alt="Avatar" class="md:ml-5 scale-150 drop-shadow-bold md:pr-5" />
			<button
				on:click={shuffleAvatars}
				class="hover:rotate-[100deg] transition-all rounded-full absolute md:-bottom-[3.5rem] md:-right-[3.5rem] -right-[3rem] bg-red h-12 w-12 md:h-[4rem] md:w-[4rem] flex justify-center items-center drop-shadow-bold"
			>
				<Dice height={20} width={20} />
			</button>
		</div>
		<ButtonArrow color="#ff847c" rotation={82} on:click={nextAvatar} />
	</div>
	<div class="max-w-max grid justify-items-start">
		<p class="font-contrail text-white text-xl sm:text-3xl -rotate-[5deg] max-w-max mt-10 -mb-7 sm:-mb-5 lg:mt-0 md:mb-0 ">you're playing...</p>
		<Title title={category.name ?? ''} subtitle="create your player" flip={false} />
		<label for="playername">
			<input
				type="text"
				bind:value={playerName}
				name="playername"
				autocomplete="off"
				placeholder="how should we call you?"
				class="font-contrail w-[250px] p-2 drop-shadow-bold relative z-10 focus-visible:outline-none"
			/>
		</label>
		<div class="mt-5 -ml-4 max-w-max">
			<ButtonSmall text="I'M READY" accent_color="#ff847c" on:click={handlePlayerSelection} />
		</div>
	</div>
</div>
