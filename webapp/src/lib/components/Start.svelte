<script lang="ts">
	import ButtonBig from '$lib/components/ButtonBig.svelte';
	import logo from '$lib/assets/logo.svg';
	import TextBlock from '$lib/components/TextBlock.svelte';
</script>

<div class="flex flex-col items-center gap-10">
	<img class="max-w-md" src={logo} alt="Flashback Fiesta" />
	<div class="grid grid-cols-3">
		<div class="col-start-2 col-end-2 justify-self-center">
			<ButtonBig text="START GAME" accent_color="#ff847c" />
		</div>
		<div class="justify-self-center">
			<TextBlock
				text="Dive into the ultimate pop culture challenge with Flashback Fiesta! <br><br> Are you ready to reminisce and rise to the challenge? Join the fiesta and prove your pop culture knowledge in music, games, films and tv shows!"
			/>
		</div>
	</div>
</div>
