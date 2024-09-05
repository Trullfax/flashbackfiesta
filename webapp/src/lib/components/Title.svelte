<script lang="ts">
	import triangle from '$lib/assets/elements/title_triangle.svg';

	export let title: string;
	export let subtitle: string = '';
	export let flip: boolean = false;
</script>

<div class="grid grid-cols-2 relative w-[80vw] sm:w-[50vw] lg:w-[30vw] mt-10 mb-12">
	<h1 class="col-span-full justify-self-start font-contrail text-yellow text-[3rem] sm:text-[5rem] z-30 -rotate-[5deg] drop-shadow-title">{title}</h1>
	<h2 class="col-span-full justify-self-end font-vampiro text-white text-[1.5rem] sm:text-[2.2rem] z-50 -rotate-[5deg] drop-shadow-subtitle">
		{subtitle}
	</h2>
	<img
		src={triangle}
		alt="triangle shape"
		class={`-top-[3.5rem] -left-10 sm:-top-[6rem] sm:-left-10 z-10 absolute ${flip ? 'scale-x-[-1] -rotate-[10deg]' : ''}`}
	/>
</div>
