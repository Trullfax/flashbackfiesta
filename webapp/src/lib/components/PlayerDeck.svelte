<script lang="ts">
	export let player: Player;

	export let turn: boolean = false;

	export let category: Category;
</script>

<div class="flex max-w-max h-max gap-6">
	<img
		src={player.avatar_path}
		alt={`avatar of ${player.name}`}
		class="size-24 drop-shadow-bold {turn ? 'animate-pulse' : ''}"
	/>
	<div class="w-[10rem] flex max-w-max h-max flex-col gap-4">
		<p class="font-contrail text-[1.5rem] text-black translate-y-[0.25rem]">
			{player.name}
		</p>
		<div class="flex max-w-max translate-x-[0.25rem]">
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
	</div>
</div>
