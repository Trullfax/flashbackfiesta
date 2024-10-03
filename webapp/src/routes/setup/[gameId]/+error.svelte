<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ButtonSmall from '$lib/components/ButtonSmall.svelte';

	console.warn($page.error?.message ?? '');
</script>

<svelte:head>
	<title>bazinga! · Flashbackfiesta</title>
</svelte:head>

<main class="flex p-10 sm:p-20 items-center">
	<div class="flex flex-col gap-8">
		<p class="font-contrail text-[5rem] text-yellow -rotate-[5deg] drop-shadow-title">BAZINGA</p>
		<p class="font-contrail text-[2rem] text-white">
			something went wrong. <br /> game you tried to join does not exist or is still running.
		</p>
		<ButtonSmall text="BACK TO START" on:click={() => goto('/')} />
	</div>
</main>
