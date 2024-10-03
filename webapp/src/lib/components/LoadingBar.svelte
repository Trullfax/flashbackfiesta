<script lang="ts">
	export let color: String = '#fff';
</script>

<span class="loader" style="--loader-color: {color};"></span>

<style>
	.loader {
		width: 100%;
		height: 4.8px;
		display: inline-block;
		position: relative;
		background: rgba(255, 255, 255, 0.15);
		overflow: hidden;
	}
	.loader::after {
		content: '';
		width: 192px;
		height: 4.8px;
		background: var(--loader-color);
		position: absolute;
		top: 0;
		left: 0;
		box-sizing: border-box;
		animation: animloader 2s linear infinite;
	}

	@keyframes animloader {
		0% {
			left: 0;
			transform: translateX(-100%);
		}
		100% {
			left: 100%;
			transform: translateX(0%);
		}
	}
</style>
