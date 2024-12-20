<script lang="ts">
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/logo.svg';
	import ButtonSmall from '$lib/components/ButtonSmall.svelte';
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
		class="imprint w-[80vw] max-w-[800px] font-contrail text-white flex flex-col items-start"
	>
		<div class="flex flex-col items-center mb-10 mt-10 self-center">
			<a href="/">
				<img class="h-[10rem] max-w-[19rem]" src={logo} alt="Flashback Fiesta" />
			</a>
			<ButtonSmall text="BACK TO START" on:click={() => goto('/')} />
		</div>

		<h1 class="font-contrail text-yellow drop-shadow-subtitle">Imprint</h1>
		<h2>Licensing Information</h2>
		<h3>Code License</h3>
		<p>
			This project is open-source and the code is licensed under the GNU General Public License v3.0
			(<a href="GNU General Public License v3.0">GPL-3.0</a>).<br />
			You are free to use, modify, and distribute the software under the terms of this license, as long
			as you adhere to its requirements, including the need to share any modifications under the same
			license.<br />
			For more details on the terms and conditions of this license, please refer to the LICENSE file
			in the <a href="https://github.com/Trullfax/flashbackfiesta">GitHub repository</a>.
		</p>

		<h3>Data Attribution</h3>
		<h4>Wikidata</h4>
		<p>
			This project incorporates data from Wikidata, which is licensed under the CC0 1.0 Universal
			(CC0 1.0) Public Domain Dedication. This means that the data is free to use for any purpose,
			without any restrictions. More information on the Wikidata license can be found <a
				href="https://www.wikidata.org/wiki/Wikidata:Licensing">here</a
			>.
		</p>
		<h4>The Movie Database (TMDb)</h4>
		<p>
			This project uses data and images from The Movie Database (TMDb) API for movies and TV shows.
			<b>Please note that this application is not endorsed or certified by TMDb.</b> The use of TMDb
			content complies with their API Terms of Use for non-commercial applications. You can find
			TMDb’s licensing terms and guidelines for proper usage on
			<a href="https://www.themoviedb.org/">their official website</a>.
		</p>
		<h4>Libraries</h4>
		<p>
			This project utilizes the Lucide icon set, which is licensed under the ISC License, and the
			Svelte Confetti library, which is licensed under the MIT License. Proper attribution has been
			provided in accordance with the terms of these licenses. For more details on the usage and
			licensing of these libraries, you can refer to their respective repositories: <a
				href="https://lucide.dev/license">Lucide</a
			>
			and
			<a href="https://mitcheljager.github.io/svelte-confetti/">Svelte Confetti</a>.
		</p>
	</section>
	<div class="bg-purple p-5 w-screen flex flex-row gap-8 justify-center items-center">
		<a href="/privacy" class="font-contrail text-white text-lg">PRIVACY</a>
	</div>
</main>

<style>
	.imprint h1 {
		font-size: 3rem;
		line-height: 3rem;
		margin-bottom: 2rem;
	}
	.imprint h2 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}
	.imprint h3 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}
	.imprint h4 {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
	}
	.imprint a {
		color: var(--ff-yellow);
		text-decoration: underline;
	}
	.imprint p {
		margin-bottom: 2rem;
	}
</style>
