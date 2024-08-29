<script lang="ts">
	import { page } from '$app/stores';

	console.warn($page.error?.message ?? '');
</script>

<main class="flex p-20 items-center">
	<div class="flex flex-col gap-8">
		<p class="font-contrail text-[5rem] text-yellow -rotate-[5deg] drop-shadow-title">BAZINGA</p>
		<p class="font-contrail text-[2rem] text-white">
			the game you tried to join does not exist or is still running
		</p>
	</div>
</main>
