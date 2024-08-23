<script lang="ts">
	export let text: string;
	export let accent_color: string = '#ff847c';
</script>

<div class="w-[12rem] h-[4rem] relative flex items-center justify-center group">
	<button on:click class="w-[10rem] h-[2rem] flex justify-center items-center bg-yellow group-hover:bg-purple transition-all z-20 absolute">
		<p class="font-contrail group-hover:text-white transition-all">{text}</p>
	</button>
	<div
		class="w-[10rem] h-[2rem] right-5 top-6 border-[0.4rem] z-10 -rotate-[4deg] group-hover:-rotate-[2deg] transition-all absolute"
		style="border-color: {accent_color}"
	/>
	<div class="w-[10rem] h-[2rem] left-6 top-6 border-[0.4rem] z-0 rotate-[2deg] group-hover:rotate-[4deg] transition-all absolute" />
</div>
