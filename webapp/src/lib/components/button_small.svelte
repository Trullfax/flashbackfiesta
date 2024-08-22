<script lang="ts">
	export let text: string;
	export let accent_color: string = '#ff847c';
</script>

<div class="w-[12rem] h-[4rem] relative flex items-center justify-center">
	<button class="w-[10rem] h-[2rem] flex justify-center items-center bg-yellow z-20 absolute">
		<p class="font-contrail">{text}</p>
	</button>
	<div
		class="w-[10rem] h-[2rem] right-5 top-6 border-[0.4rem] z-10 -rotate-[4deg] border-[{accent_color}] absolute"
	/>
	<div class="w-[10rem] h-[2rem] left-6 top-6 border-[0.4rem] z-0 rotate-[2deg] absolute" />
</div>
