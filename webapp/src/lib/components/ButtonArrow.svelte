<script lang="ts">
	export let color: string = '';
	export let rotation: number = 0;
</script>

<button class="relative group flex justify-center" on:click>
	<svg
		width="99"
		height="63"
		viewBox="0 0 99 63"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		style="transform: rotate({rotation}deg);"
		class="absolute top-1 left-3"
	>
		<path
			d="M10.8594 57.25L49.5 8.09094L88.1406 57.25L10.8594 57.25Z"
			stroke="#1d1e1d"
			stroke-width="10"
            class="group-hover:scale-95 transition-all"
		/>
	</svg>
	<svg
		width="99"
		height="63"
		viewBox="0 0 99 63"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		style="transform: rotate({rotation}deg);"
	>
		<path
			d="M10.8594 57.25L49.5 8.09094L88.1406 57.25L10.8594 57.25Z"
			stroke={color}
			stroke-width="10"
            class="group-hover:scale-90 transition-all"
		/>
	</svg>
</button>
