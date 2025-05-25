<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		const isGameSetupNavigation: boolean =
			navigation.from?.route.id === '/' && navigation.to?.route.id === '/(game)/setup/[gameId]';

		document.documentElement.setAttribute(
			'is-game-setup-navigation',
			String(isGameSetupNavigation)
		);

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	function updateHeight() {
		let height = window.innerHeight;
		document.documentElement.style.setProperty('--slide-height', `${height}px`);
	}

	onMount(() => updateHeight());
</script>

<svelte:window on:resize={updateHeight} />

<slot />

<style>
	@keyframes slide-from-bottom {
		from {
			transform: translateY(var(--slide-height));
		}
	}

	@keyframes slide-to-top {
		to {
			transform: translateY(calc(var(--slide-height) * -1));
		}
	}

	/* Game setup transition styles */
	:root[is-game-setup-navigation='true']::view-transition-old(root) {
		animation: 1000ms cubic-bezier(0.4, 0, 0.2, 1) slide-to-top;
	}

	:root[is-game-setup-navigation='true']::view-transition-new(root) {
		animation: 1000ms cubic-bezier(0.4, 0, 0.2, 1) slide-from-bottom;
	}
</style>
