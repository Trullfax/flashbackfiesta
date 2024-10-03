<script lang="ts">
	export let accentColor: string;
</script>

<!-- Can be adjusted to an universal loading component -->

<div
	class="animate-pulse group relative w-[10rem] h-[15rem] rounded-lg overflow-hidden"
	style="background-color: {accentColor};">

	<div class="absolute bottom-1 p-2">
		<div class="m-2 w-[8rem] h-2 bg-grey z-10"></div>
        <div class="m-2 w-[8rem] h-4 bg-grey z-10"></div>
        <div class="m-2 w-[8rem] h-3 bg-grey z-10"></div>

	</div>
</div>