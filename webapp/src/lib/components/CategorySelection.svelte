<script lang="ts">
	import ButtonSmall from '$lib/components/ButtonSmall.svelte';
	import Title from '$lib/components/Title.svelte';

	// export let categories: Category[];
</script>

<div class="border-2 flex flex-col items-center">
	<div class="w-[60rem] flex justify-start border-2">
		<Title title="CATEGORY" subtitle="choose a category" flip={true} />
	</div>
	<div>
		<p class="font-contrail text-8xl text-yellow drop-shadow-bold">HI</p>
	</div>
	<div>
		<ButtonSmall text="LET'S PLAY" accent_color="#ff847c" />
	</div>
</div>
