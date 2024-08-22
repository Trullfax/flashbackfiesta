<script lang="ts">
	import ButtonBig from '$lib/components/ButtonBig.svelte';
	import ButtonSmall from '$lib/components/ButtonSmall.svelte';

	// Glob import all SVG files from the avatars directory
	const avatars = import.meta.glob('$lib/assets/avatars/*.svg', { eager: true });

	// Type definitions for the module imports
	interface SvgModule {
		default: string;
	}

	// Extract the default export (the path) of each module
	const avatarArray: string[] = Object.values(avatars).map((mod) => (mod as SvgModule).default);
</script>

<header class="text-center mb-8">
	<h1 class="text-4xl font-bold font-contrail mb-4 text-black">Color Palette Showcase</h1>
	<p class="text-lg text-black font-vampiro">
		This page demonstrates the color palette defined in Tailwind CSS.
	</p>
</header>

<main class="flex flex-col items-center gap-10">
	<h1>Welcome to Flashbackfiesta!</h1>

	<ul>
		{#each avatarArray as avatar}
			<li><img src={avatar} alt="Avatar" /></li>
		{/each}
	</ul>

	<ButtonSmall text="LET'S PLAY" accent_color="#54e5c4" />
	<ButtonBig text="LET'S PLAY" accent_color="#54e5c4" />

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