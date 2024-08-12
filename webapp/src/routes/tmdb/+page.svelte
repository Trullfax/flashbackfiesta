<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
	const { movies } = data;

</script>

<h1>Movie Overview</h1>

{#if movies.length > 0}
    <div class="movie-grid">
        {#each movies as movie, i}
            <div class="movie-card">
                <p>{i + 1}</p>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div class="movie-info">
                    <h2>{movie.title}</h2>
                    <p>{movie.year}</p>
                </div>
            </div>
            
        {/each}
    </div>
{:else}
    <p>No movies found.</p>
{/if}

<style>
    /* Basic styling for the movie grid */
    .movie-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
    }

    .movie-card {
        background-color: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .movie-card img {
        width: 100%;
        height: auto;
        display: block;
    }

    .movie-info {
        padding: 8px;
        text-align: center;
    }
</style>