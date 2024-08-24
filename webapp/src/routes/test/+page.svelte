<script lang="ts">
	import ButtonBig from '$lib/components/ButtonBig.svelte';
	import ButtonSmall from '$lib/components/ButtonSmall.svelte';
	import CategorySelection from '$lib/components/CategorySelection.svelte';
	import Title from '$lib/components/Title.svelte';

	// Glob import all SVG files from the avatars directory
	const avatars = import.meta.glob('/assets/categories/*.svg', { eager: true });

	// Type definitions for the module imports
	interface SvgModule {
		default: string;
	}

	// Extract the default export (the path) of each module
	const avatarArray: string[] = Object.values(avatars).map((mod) => (mod as SvgModule).default);

	let categories: { name: string; picture_path: string }[] = [
		{ name: 'Movies', picture_path: 'assets/categories/movie-card.svg' },
		{ name: 'Videogames', picture_path: 'assets/categories/game-card.svg' },
		{ name: 'Music', picture_path: 'assets/categories/music-card.svg' },
		{ name: 'TV Shows', picture_path: 'assets/categories/tv-card.svg' }
	];
</script>

<main class="flex flex-col items-center gap-10">
	<h1 class="text-[5rem] font-contrail text-yellow drop-shadow-title">
		Welcome to Flashbackfiesta!
	</h1>

	<ul>
		{#each avatarArray as avatar}
			<li><img src={avatar} alt="Avatar" /></li>
		{/each}
	</ul>

	<ButtonSmall text="LET'S PLAY" accent_color="#ff847c" />
	<ButtonBig text="LET'S PLAY" accent_color="#ff847c" />

	<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
		<div class="bg-white p-6 rounded-lg shadow-lg">
			<h2 class="text-2xl font-semibold text-black">White</h2>
			<div class="mt-4 h-24 w-full bg-white border-2 border-black rounded"></div>
		</div>

		<div class="bg-white p-6 rounded-lg shadow-lg">
			<h2 class="text-2xl font-semibold text-black">Black</h2>
			<div class="mt-4 h-24 w-full bg-black rounded"></div>
		</div>

		<div class="bg-white p-6 rounded-lg shadow-lg">
			<h2 class="text-2xl font-semibold text-black">Grey</h2>
			<div class="mt-4 h-24 w-full bg-grey rounded"></div>
		</div>

		<div class="bg-white p-6 rounded-lg shadow-lg">
			<h2 class="text-2xl font-semibold text-black">Green</h2>
			<div class="mt-4 h-24 w-full bg-green rounded"></div>
		</div>

		<div class="bg-white p-6 rounded-lg shadow-lg">
			<h2 class="text-2xl font-semibold text-black">Red</h2>
			<div class="mt-4 h-24 w-full bg-red rounded"></div>
		</div>

		<div class="bg-white p-6 rounded-lg shadow-lg">
			<h2 class="text-2xl font-semibold text-black">Purple</h2>
			<div class="mt-4 h-24 w-full bg-purple rounded"></div>
		</div>

		<div class="bg-white p-6 rounded-lg shadow-lg">
			<h2 class="text-2xl font-semibold text-black">Yellow</h2>
			<div class="mt-4 h-24 w-full bg-yellow rounded"></div>
		</div>

		<div class="bg-white p-6 rounded-lg shadow-lg">
			<h2 class="text-2xl font-semibold text-black">Blue</h2>
			<div class="mt-4 h-24 w-full bg-blue rounded"></div>
		</div>
	</div>

	<div class="flex flex-row">
		<Title title="CATEGORY" subtitle="choose a category" flip={true} />
		<Title title="VIDEOGAMES" subtitle="create your player" />
	</div>

	<CategorySelection {categories} />
</main>

<style>
	ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 10px; /* Space between avatars */
	}

	li {
		display: inline-block;
	}

	img {
		width: 100px; /* Fixed width */
		height: 100px; /* Fixed height */
		object-fit: cover; /* Ensures images are resized to fit the container */
		border-radius: 50%; /* Optional: makes images circular */
		border: 2px solid #ddd; /* Optional: adds a border around the images */
	}
</style>
