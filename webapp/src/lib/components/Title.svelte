<script lang="ts">
	import triangle from '$lib/assets/elements/title_triangle.svg';

	export let title: string;
	export let subtitle: string = '';
	export let flip: boolean = false;
</script>

<div class="w-[30rem] h-[15rem] relative">
	<div class="font-contrail top-[3rem] left-[2.25rem] absolute">
		<p class="text-[5rem] text-yellow z-30 -rotate-[5deg] drop-shadow-title absolute">{title}</p>
	</div>
	<div class="w-[25rem] top-[7.25rem] left-[7.5rem] font-vampiro absolute">
		<p class="text-white text-[2.2rem] z-50 -rotate-[5deg] drop-shadow-subtitle absolute">
			{subtitle}
		</p>
	</div>
	<img
		src={triangle}
		alt="triangle shape"
		class={`z-10 absolute ${flip ? 'scale-x-[-1] -rotate-[10deg]' : ''}`}
	/>
</div>
