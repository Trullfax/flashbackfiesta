<script lang="ts">
	interface Country {
		name: string;
	}

	export let data: { countries: Country[] };
</script>

<ul>
	<h1>oleee Countries!!!</h1>
	<p>helooooo</p>
	<p>help</p>
	{#each data.countries as country}
		<li>{country.name}</li>
	{/each}
</ul>