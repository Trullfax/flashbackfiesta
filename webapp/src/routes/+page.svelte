<script lang="ts">
	// Glob import all SVG files from the avatars directory
	const avatars = import.meta.glob('$lib/assets/avatars/*.svg', { eager: true });

	// Type definitions for the module imports
	interface SvgModule {
		default: string;
	}

	// Extract the default export (the path) of each module
	const avatarArray: string[] = Object.values(avatars).map((mod) => (mod as SvgModule).default);
</script>

<h1>Welcome to Flashbackfiesta!</h1>

<ul>
	{#each avatarArray as avatar}
		<li><img src={avatar} alt="Avatar" /></li>
	{/each}
</ul>
#

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
