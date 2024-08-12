// TODO: in this, find a way to filter out really weird or trash movies

export async function getMovies(count: number): Promise<movie[]> {
    let movies: movie[] = [];
    const resultsPerPage = 20;
    const pagesNeeded = Math.ceil(count / resultsPerPage);

    const includeAdult = "false";
    const includeVideo = "false";
    const lang = "en-US";
    const sortBy = "popularity.desc"; // Sort by popularity in descending order

    // Limit the page range to focus on popular movies (e.g., first 100 pages)
    const maxPage = 50;

    // Generate different pages for each request
    const fetchPromises = Array.from({ length: pagesNeeded }, async () => {
        const page = Math.floor(Math.random() * maxPage) + 1;
        const url = `${process.env.PUBLIC_TMDB_URL}/discover/movie?include_adult=${includeAdult}&include_video=${includeVideo}&language=${lang}&sort_by=${sortBy}&page=${page}&api_key=${process.env.TMDB_SECRET_API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch movies: ${response.statusText}`);
        }

        return await response.json();
    });

    const responses = await Promise.all(fetchPromises);

    for (const response of responses) {
        if (response.results) {
            // Filter out movies that have the same year as those already in the list
            for (const movie of response.results) {
                const year = new Date(movie.release_date).getFullYear().toString();
                if (!movies.some(m => m.year === year)) {
                    movies.push(movie);
                }
                if (movies.length >= count) break; // Stop if we have enough movies
            }
        }
        if (movies.length >= count) break; // Stop if we have enough movies
    }

    // Deduplicate and trim the movie list
    movies = Array.from(new Set(movies.map(movie => movie.id)))
        .map(id => movies.find(movie => movie.id === id)!)
        .slice(0, count);

    return movies.map(movie => ({
        title: movie.title,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        id: movie.id,
        year: new Date(movie.release_date).getFullYear().toString(),
    }));
}
