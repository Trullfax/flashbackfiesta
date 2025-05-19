<script lang="ts">
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/logo.svg';
	import ButtonSmall from '$lib/components/ButtonSmall.svelte';
	import markdownit from 'markdown-it';
	import { onMount } from 'svelte';

	let privacyText: string | undefined;

	onMount(async () => {
		const response = await fetch('/assets/text/privacy.mkd');

		const data = await response.text();
		const md = new markdownit();
		privacyText = md.render(data);
	});
</script>

<svelte:head>
	<title>Licensing and Legal Information · Flashbackfiesta</title>
	<meta
		name="description"
		content="Imprint page for Flashback Fiesta. Includes licensing information for the GNU General Public License v3.0, data attribution for Wikidata and TMDb, and details about the libraries used, such as Lucide and Svelte Confetti."
	/>
</svelte:head>

<main class="relative w-[100vw] overflow-scroll flex flex-col items-center">
	<section
		class="article w-[80vw] max-w-[800px] font-contrail text-white flex flex-col items-start"
	>
		<div class="flex flex-col items-center mb-10 mt-10 self-center">
			<a href="/">
				<img class="h-[10rem] max-w-[19rem]" src={logo} alt="Flashback Fiesta" />
			</a>
			<ButtonSmall text="BACK TO START" on:click={() => goto('/')} />
		</div>

		{@html privacyText}
	</section>
	<div class="bg-purple p-5 w-screen flex flex-row gap-8 justify-center items-center">
		<a href="/imprint" class="font-contrail text-white text-lg">IMPRINT</a>
	</div>
</main>
