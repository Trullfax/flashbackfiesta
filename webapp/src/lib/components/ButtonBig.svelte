<script lang="ts">
	export let text: string;
	export let accent_color: string = '#ff847c';
</script>

<div class="w-[19rem] h-[7rem] relative flex items-center justify-center group">
	<button
		class="w-[15rem] h-[4rem] flex justify-center items-center bg-yellow group-hover:bg-purple transition-all z-20 absolute"
	>
		<p class="font-contrail text-3xl group-hover:text-white transition-all">{text}</p>
	</button>
	<div
		class="w-[15rem] h-[4rem] right-10 top-8 border-[0.5rem] z-10 -rotate-[4deg] absolute"
		style="border-color: {accent_color}"
	/>
	<div
		class="w-[15rem] h-[4rem] left-12 top-8 border-[0.5rem] z-0 rotate-[2deg] group-hover:rotate-[6deg] transition-all absolute"
	/>
</div>
