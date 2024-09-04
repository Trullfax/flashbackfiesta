<script lang="ts">
	export let text: string;
	export let hover_white: boolean = false;
	export let accent_color: string = 'var(--ff-red)';
</script>

<div class="w-[19rem] h-[7rem] relative flex items-center justify-center group">
	<button
		on:click
		class="w-[15rem] h-[4rem] flex justify-center items-center bg-yellow transition-all z-20 absolute {hover_white
			? 'group-hover:bg-white'
			: 'group-hover:bg-purple'}"
	>
		<p
			class="font-contrail text-3xl {hover_white
				? 'group-hover:text-black'
				: 'group-hover:text-white'} transition-all"
		>
			{text}
		</p>
	</button>
	<div
		class="w-[15rem] h-[4rem] right-10 top-8 border-[0.5rem] z-10 -rotate-[3.8deg] group-hover:-rotate-[7deg] transition-all absolute"
		style="border-color: {accent_color}"
	/>
	<div
		class="w-[15rem] h-[4rem] left-12 top-8 border-[0.5rem] z-0 rotate-[2deg] group-hover:rotate-[5deg] transition-all absolute"
	/>
</div>
