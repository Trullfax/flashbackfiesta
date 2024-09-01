<script lang="ts">
	export let text: string;
	export let accentColor: string = '#ff847c';
</script>

<button
	class="scale-75 w-[10rem] h-[4rem] relative flex items-center justify-center group"
	on:click
>
	<div
		class="p-2 h-[2rem] flex justify-center items-center bg-yellow group-hover:bg-purple transition-all z-20 absolute"
	>
		<p class="font-contrail text-sm group-hover:text-white transition-all">{text}</p>
	</div>
	<div
		class="invisible group-hover:visible flex justify-center items-center absolute w-[10rem] h-[15rem] border-dashed border-[.2rem] rounded-lg overflow-hidden transition-all"
		style="border-color: {accentColor};"
	></div>
	<div
		class="w-[5rem] h-[2rem] right-12 top-6 border-[0.4rem] z-10 -rotate-[4deg] group-hover:-rotate-[2deg] transition-all absolute"
		style="border-color: {accentColor}"
	/>
	<div
		class="w-[5rem] h-[2rem] left-12 top-6 border-[0.4rem] z-0 rotate-[2deg] group-hover:rotate-[4deg] transition-all absolute"
	/>
</button>
