<script lang="ts">
	import ButtonBig from './ButtonBig.svelte';

	export let category: Category;
	export let winner: Player | null = null;
	export let winner_self: boolean = false;
</script>

<div class="h-screen w-screen bg-black bg-opacity-25 absolute z-30">
	<div class="flex items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
		<div class="flex flex-col items-center">
			{#if winner !== null}
				<img
					src={winner.avatar_path}
					alt="avatar of {winner.name}"
					class="w-[5rem] md:w-[9rem] z-50 drop-shadow-subtitle md:drop-shadow-bold rotate-[-3deg]"
				/>
			{/if}
			<div
				class="max-w-[30rem] h-[20rem] bg-purple drop-shadow-bold -translate-y-[5rem] flex flex-col justify-center items-center"
			>
				<div class=" flex flex-col items-center justify-center translate-y-[2.75rem]">
					{#if winner !== null}
						<h2 class="text-4xl text-center text-white font-contrail">
							{winner_self ? 'Congratulations!' : 'Oh no!'}
						</h2>
						<p class="text-2xl text-center text-white font-contrail">
							{winner_self ? 'You' : winner.name} won the fiesta!
						</p>
					{/if}
					<ButtonBig text="BACK TO START" hover_white={true} on:click />
				</div>
			</div>
		</div>
		<div class="absolute -rotate-[25deg] -right-[2.5rem] top-[10rem]">
			<img
				src={category.picture_path}
				alt="categorycard for {category.name}"
				class="w-[5rem] z-40"
			/>
		</div>
		<div class="absolute rotate-[5deg] -right-[2.5rem] top-[10rem]">
			<img
				src={category.picture_path}
				alt="categorycard for {category.name}"
				class="w-[5rem] z-40"
			/>
		</div>
		<div class="absolute rotate-[14deg] -left-6 top-[11rem]">
			<img
				src={category.picture_path}
				alt="categorycard for {category.name}"
				class="w-[5rem] z-40"
			/>
		</div>
	</div>
</div>
