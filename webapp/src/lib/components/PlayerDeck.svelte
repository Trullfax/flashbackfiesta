<script lang="ts">
	export let player: Player;

	export let turn: boolean = false;

	export let category: Category;
</script>

<div class="grid grid-cols-2 sm:grid-cols-1 sm:flex gap-2 sm:gap-6">
	<img
		src={player.avatar_path}
		alt={`avatar of ${player.name}`}
		class="size-10 sm:size-20 drop-shadow-title sm:drop-shadow-bold {turn ? 'animate-pulse' : ''}"
	/>
	<div
		class="sm:w-[10rem] flex max-w-full sm:h-max flex-col justify-center items-start gap-2 sm:gap-4"
	>
		<p
			class="font-contrail text-[.7rem] sm:text-[1.5rem] text-black translate-y-[0.25rem] break-all"
		>
			{player.name}
		</p>
		<div class="hidden sm:flex max-w-max translate-x-[0.25rem]">
			{#each Array(player.cards_count) as _, index}
				<div
					class="relative {index % 2 === 0
						? '-rotate-[3deg] translate-y-[0.1rem]'
						: 'rotate-[2deg]'}"
					style="z-index:{index * -1}; margin-left: -0.25rem;"
				>
					<div
						class="flex justify-end items-end w-[1.75rem] h-[2.75rem] border-[0.15rem] rounded-[0.2rem] drop-shadow-[0.2rem__0_rgba(0,0,0,0.25)]"
						style="background-color: {category.hex_color};"
					/>
				</div>
			{/each}
		</div>
		<div class="sm:hidden flex gap-2 max-w-max translate-x-[0.25rem]">
			<div class="flex">
				{#each Array(player.cards_count) as _, index}
					<div
						class="relative {index % 2 === 0
							? '-rotate-[3deg] translate-y-[0.1rem]'
							: 'rotate-[2deg]'}"
						style="z-index:{index * -1}; margin-left: -0.15rem;"
					>
						<div
							class="w-[.65rem] h-[1.15rem] border-[0.07rem] rounded-[0.07rem] rotate-[7deg] drop-shadow-[0.2rem__0_rgba(0,0,0,0.25)]"
							style="background-color: {category.hex_color};"
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
