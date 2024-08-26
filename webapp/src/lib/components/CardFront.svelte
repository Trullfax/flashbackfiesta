<script lang="ts">
	export let title: string;
	export let subtitle: string;
	export let imagePath: string;
	export let accent_color: string;
	export let year: number;
	export let revealed: boolean = false;
</script>

<div
	class="group relative w-[10rem] h-[15rem] border-[.4rem] rounded-lg overflow-hidden"
	style="border-color: {accent_color};"
>
	<img class="absolute" src={imagePath} alt={title} />
	<div
		class="block absolute w-[100%] h-[100%]"
		style="background: linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(0,0,0,1) 10%, rgba(255,255,255,0) 100%);"
	></div>
	<div class="absolute bottom-1 p-2 font-contrail text-white">
		<p class="text-[10px] mb-1">{subtitle}</p>
		<h1 class="text-lg/[20px]">{title}</h1>
		{#if revealed}
			<p class="mt-1">{year}</p>
		{/if}
	</div>
</div>
