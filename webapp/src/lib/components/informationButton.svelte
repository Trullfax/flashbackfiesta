<script lang="ts">
	import { Github, Users, Info, X } from 'lucide-svelte';
	import TutorialGraphic from '$lib/assets/elements/TutorialGraphic.svg';

	let expand: Boolean = false;
</script>

{#if !expand}
	<button
		class="fixed z-[100] bottom-[2rem] md:bottom-[2rem] lg:bottom-[4rem] left-[2rem] md:left-[2rem] lg:left-[4rem] p-3 rounded-full bg-purple drop-shadow-subtitle lg:scale-125"
		on:click={() => (expand = true)}
	>
		<Info class="text-white" size={35} />
	</button>
{/if}
{#if expand}
	<div
		class="fixed z-[90] w-full h-[100dvh] backdrop-blur-lg transition-all flex flex-col justify-between items-center"
	>
		<button
			class="self-end mt-[2rem] md:mt-[2rem] lg:mt-[4rem] mr-[2rem] md:mr-[2rem] lg:mr-[4rem] drop-shadow-subtitle z-10 lg:scale-125"
			on:click={() => (expand = false)}
		>
			<X size={48} color="var(--ff-white)" strokeWidth={3} />
		</button>

		<div
			class="h-[60dvh] w-full p-6 flex flex-col md:flex-row lg:flex-col gap-6 items-center justify-center -translate-y-[1rem]"
		>
			<div
				class="max-w-[40rem] lg:max-w-[30rem] font-contrail text-md text-left p-5 bg-white drop-shadow-bold grid place-items-center md:grid-cols-[35vw_25vw] lg:grid-cols-1"
			>
				<p>
					Flashback Fiesta is the ultimate pop culture card game! Test your knowledge in different
					categories and play against your friends! <br />
				</p>
				<img
					src={TutorialGraphic}
					alt="Tutorial graphic"
					class="max-h-[25dvh] md:max-h-[45dvh] lg:max-h-[35dvh] mt-6 md:mt-0 lg:mt-6 mb-6 md:mb-0 lg:mb-6 md:col-start-2 lg:col-start-1 md:row-span-3 lg:row-span-1 md:self-center"
				/>
				<p>
					Now for the fun part! It's time to place all the cards from your hand in the correct
					order.
				</p>
				<div class="flex flex-row gap-2 mt-4">
					<Users />
					<p>1-4 Players</p>
				</div>
			</div>
		</div>

		<div
			class=" bg-purple p-5 pb-3 md:pb-5 w-full flex flex-col md:flex-row lg:flex-col md:justify-around items-center gap-4 font-contrail text-white"
		>
			<div class="flex flex-row gap-8 justify-center">
				<a href="/imprint" class="text-lg">IMPRINT</a>
				<a href="/privacy" class=" text-lg">PRIVACY</a>
				<a href="https://github.com/Trullfax/flashbackfiesta" class="text-lg">GITHUB</a>
			</div>
			<p class="text-sm text-center">
				made with ♥ by Anna-Lena Langhans and Tjalf-Bjarne Scharnweber
			</p>
		</div>
	</div>
{/if}

<style>
	.info h1 {
		font-size: 3rem;
		line-height: 3rem;
		margin-bottom: 2rem;
	}
	.info h2 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}
	.info h3 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}
	.info h4 {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
	}
	.info a {
		color: var(--ff-yellow);
		text-decoration: underline;
	}
	.info p {
		margin-bottom: 2rem;
	}
</style>
