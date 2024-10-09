<script lang="ts">
	import ButtonBig from '$lib/components/ButtonBig.svelte';
	import logo from '$lib/assets/logo.svg';
	import TextBlock from '$lib/components/TextBlock.svelte';
</script>

<div
	class="grid grid-cols-1 md:grid-cols-3 justify-items-center grid-rows-[15vh_15vh_33vh] md:grid-rows-[8.5rem_8rem] lg:grid-rows-[16rem_13rem] self-end md:self-center mb-10 md:mb-0"
>
	<img class="max-w-[19rem] lg:max-w-[30rem] md:col-start-2" src={logo} alt="Flashback Fiesta" />
	<div class="scale-[80%] lg:scale-[100%] md:row-start-2 md:col-start-2">
		<ButtonBig text="START GAME" accent_color="#ff847c" on:click />
	</div>
	<div class="self-end md:row-start-2 md:col-start-3">
		<TextBlock
			text="Dive into the ultimate pop culture challenge with Flashback Fiesta! <br><br> Are you ready to reminisce and rise to the challenge? Join the fiesta and prove your pop culture knowledge!"
		/>
	</div>
</div>
