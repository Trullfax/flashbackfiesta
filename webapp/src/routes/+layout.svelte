<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	let barba;

	// Check if the code is running in a browser environment
	onMount(async () => {
		if (typeof window !== 'undefined') {
			// Dynamically import barba only in the browser context
			const { default: barbaLib } = await import('@barba/core');
			barba = barbaLib;

			// Initialize barba after it has been imported
			barba.init({
				transitions: [
					{
						name: 'specific-transition',
						from: { namespace: ['home'] },
						to: { namespace: ['setup'] },
						leave(data) {
							data.next.container.classList.add('fade-out');
							setTimeout(() => resolve(), 500); // Wait for animation to complete
						},
						enter(data) {
							data.next.container.classList.add('fade-in');
							setTimeout(() => resolve(), 500); // Wait for animation to complete
						}
					}
				]
			});
		}
	});
</script>

<slot />

<style>
	/* Example of basic fade animations */
	.fade-out {
		opacity: 0;
		transition: opacity 0.5s ease-in-out;
	}

	.fade-in {
		opacity: 1;
		transition: opacity 0.5s ease-in-out;
	}
</style>
