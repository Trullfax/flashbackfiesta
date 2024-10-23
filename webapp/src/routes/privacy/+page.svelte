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
		class="privacy w-[80vw] max-w-[800px] font-contrail text-white flex flex-col items-start"
	>
		<div class="flex flex-col items-center mb-10 mt-10 self-center">
			<a href="/">
				<img class="h-[10rem] max-w-[19rem]" src={logo} alt="Flashback Fiesta" />
			</a>
			<ButtonSmall text="BACK TO START" on:click={() => goto('/')} />
		</div>

		<h1 class="font-contrail text-yellow drop-shadow-subtitle">Privacy Policy</h1>
		<p>Effective Date: 22. October 2024</p>
		<h3>1. Introduction</h3>
		<p>
			Welcome to Flashback Fiesta. Your privacy is important to us. This Privacy Policy outlines how
			we handle the information you provide when using our game.
		</p>
		<h3>2. Information We Collect</h3>
		<p>
			When you play Flashback Fiesta, we only collect a name that you choose to create an avatar.
			This name is solely used for in-game display purposes, such as player identification.
		</p>
		<h3>3. How We Use Your Information</h3>
		<p>The name you provide is only used:</p>
		<p>• To display visible player interactions inside the game.</p>
		<p>
			We do not store, share, or use this name for any other purposes. No other personal information
			is collected or required to play the game.
		</p>
		<h3>4. Data Security</h3>
		<p>
			We do not store the names you provide outside of the game session. While we strive to protect
			your information, please note that no system is completely secure. However, we take reasonable
			steps to ensure the safety of the game environment.
		</p>
		<h3>5. Cookies and Tracking</h3>
		<p>
			We do not use cookies, tracking tools, or collect any additional information when you play our
			game.
		</p>
		<h3>6. Changes to This Privacy Policy</h3>
		<p>
			We may update this Privacy Policy from time to time. Any updates will be posted on this page
			with the updated effective date. We encourage you to review this policy periodically.
		</p>
	</section>
	<div class="bg-purple p-5 w-screen flex flex-row gap-8 justify-center items-center">
		<a href="/imprint" class="font-contrail text-white text-lg">IMPRINT</a>
	</div>
</main>

<style>
	.privacy h1 {
		font-size: 3rem;
		line-height: 3rem;
		margin-bottom: 2rem;
	}
	.privacy h2 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}
	.privacy h3 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}
	.privacy h4 {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
	}
	.privacy a {
		color: var(--ff-yellow);
		text-decoration: underline;
	}
	.privacy p {
		margin-bottom: 2rem;
	}
</style>
