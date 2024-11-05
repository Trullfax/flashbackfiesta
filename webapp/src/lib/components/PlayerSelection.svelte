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

<div
	class="grid md:grid-cols-2 justify-items-center items-center grid-rows-[7dvh_12dvh_30dvh_10dvh_5dvh] md:grid-rows-[1rem_10rem_4rem_4rem] lg:grid-rows-[1.5rem_14rem_5rem_4rem] -translate-y-[4dvh] md:translate-y-0 lg:-translate-y-[2rem]"
>
	<p
		class="font-contrail text-white text-2xl lg:text-4xl -rotate-[5deg] -translate-x-[4rem] md:-translate-x-[7.25rem] lg:-translate-x-[4.75rem] translate-y-[1rem]"
	>
		you're playing...
	</p>

	<div
		class="h-[9rem] scale-[70%] lg:scale-[100%] flex items-center md:-translate-x-[3.75rem] lg:-translate-x-[0em]"
	>
		<Title title={category.name ?? ''} subtitle="create your player" flip={false} />
	</div>

	<div
		class="grid grid-cols-3 items-center justify-items-center -translate-x-[0.1rem] md:col-start-1 md:row-span-4 md:row-start-1"
	>
		<!-- TODO: change this, when refactoring game page -->
		<div class="scale-[120%] md:scale-[80%]">
			<ButtonArrow color="#ff847c" rotation={-80} on:click={prevAvatar} />
		</div>
		<div class="relative">
			<img
				src={currentAvatar}
				alt="Avatar"
				class="max-w-[9rem] lg:max-w-[13rem] rotate-[1deg] drop-shadow-bold"
			/>
			<button
				on:click={shuffleAvatars}
				class="rounded-full absolute -right-[1.5rem] -bottom-[1.5rem] h-[3rem] lg:h-[4rem] w-[3rem] lg:w-[4rem] flex justify-center items-center drop-shadow-bold bg-red"
			>
				<div class="hover:rotate-[100deg] transition-all lg:scale-[130%]">
					<Dice height={20} width={20} />
				</div>
			</button>
		</div>
		<!-- TODO: change this, when refactoring game page -->
		<div class="scale-[120%] md:scale-[80%]">
			<ButtonArrow color="#ff847c" rotation={82} on:click={nextAvatar} />
		</div>
	</div>

	<label for="playername">
		<input
			type="text"
			bind:value={playerName}
			name="playername"
			autocomplete="off"
			placeholder="how should we call you?"
			class="font-contrail w-[15rem] md:w-[24rem] p-2 drop-shadow-bold relative z-10 focus-visible:outline-none -translate-x-[0.25rem]"
		/>
	</label>

	<div class="md:-translate-x-[7.25rem]">
		<ButtonSmall text="I'M READY" accent_color="#ff847c" on:click={handlePlayerSelection} />
	</div>
</div>
