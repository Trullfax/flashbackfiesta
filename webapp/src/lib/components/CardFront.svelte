<script lang="ts">
	export let title: string;
	export let subtitle: string;
	export let imagePath: string;
	export let accentColor: string;
	export let year: number;
	export let revealed: boolean = false;
	export let size: 'small' | 'large' = 'large';
</script>

<div
	class={`group relative rounded-lg overflow-hidden border-[.4rem] ${
		size === 'small' ? 'w-[7rem] h-[10rem]' : 'w-[10rem] h-[15rem]'
	}`}
	style="border-color: {accentColor};"
>
	<img class="absolute w-full h-full object-cover" src={imagePath} alt={title} />
	<div
		class="block absolute w-[100%] h-[100%]"
		style="background: linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(0,0,0,1) 10%, rgba(255,255,255,0) 100%);"
	></div>
	<div class="absolute bottom-1 p-2 font-contrail text-white">
		<p
			class={`${size === 'small' ? 'text-[8px] mb-1' : 'text-[10px] mb-1'}`}
		>
			{subtitle}
		</p>
		<h1 class={`${size === 'small' ? 'text-[12px]/[12px] mb-[2px]' : 'text-lg/[20px]'}`}>{title}</h1>
		{#if revealed}
			<p class={`mt-1 font-vampiro text-yellow drop-shadow-bold ${size === 'small' ? 'text-xl' : 'text-3xl'}`}>{year}</p>
		{/if}
	</div>
</div>
