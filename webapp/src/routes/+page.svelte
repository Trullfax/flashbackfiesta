<script lang="ts">
	interface Country {
		name: string;
	}

	export let data: { countries: Country[]; error?: string };
</script>

{#if data.error}
	<p>Error: {data.error}</p>
{:else}
	<ul>
		<p>Super big changes</p>
		<h1>Countries</h1>
		{#each data.countries as country}
			<li>{country.name}</li>
		{/each}
	</ul>
{/if}
