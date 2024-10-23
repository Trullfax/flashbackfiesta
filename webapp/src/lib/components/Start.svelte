<script lang="ts">
	import ButtonBig from '$lib/components/ButtonBig.svelte';
	import logo from '$lib/assets/logo.svg';
</script>

<div
	class="grid justify-center justify-items-center grid-rows-[18vh_10vh] md:grid-rows-[8.5rem_8rem] lg:grid-rows-[16rem_13rem] gap-2"
>
	<img class="max-w-[19rem] lg:max-w-[30rem]" src={logo} alt="Flashback Fiesta" />
	<div class="scale-[80%] lg:scale-[100%]">
		<ButtonBig text="START GAME" accent_color="#ff847c" on:click />
	</div>
</div>
