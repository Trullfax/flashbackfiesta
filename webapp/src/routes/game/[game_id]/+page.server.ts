import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // Define the shape of the query result
    interface QueryResult {
        item: {
            type: string;
            value: string;
        };
        itemLabel: {
            type: string;
            value: string;
        };
        creator: {
            type: string;
            value: string;
        };
        year: {
            type: string;
            value: string;
        };
        imageUrl?: string; // Add a field for the image URL
    }

    let queryData: QueryResult[] | null = null;
    let filteredQueryData: QueryResult[] = [];

    const TMDB_API_KEY = 'process.env.PUBLIC_TMDB_URL';

    const musicQuery = `
        SELECT DISTINCT ?item (MIN(YEAR(?year)) AS ?year) (GROUP_CONCAT(DISTINCT ?creatorLabel; separator=", ") AS ?creator) ?itemLabel ?random
        WHERE {
        ?item wdt:P31 wd:Q7366;
                wdt:P577 ?year;
                wdt:P175 ?creator;
                wikibase:sitelinks ?sitelinks.

        FILTER(?sitelinks > 10)

        # Fetch the creator's label
        ?creator rdfs:label ?creatorLabel.
        FILTER (lang(?creatorLabel) = "en")

        # Generate a hashed random value
        BIND(SHA512(CONCAT(STR(RAND()), STR(?item))) AS ?random)

        SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
        }
        GROUP BY ?item ?itemLabel ?random
        ORDER BY ?random
        LIMIT 30

        # comment, change this before each run to bypass WDQS cache: ${Math.random()}
        `;

    const filmQuery = `
        SELECT DISTINCT ?item (MIN(YEAR(?year)) AS ?year) (GROUP_CONCAT(DISTINCT ?creatorLabel; separator=", ") AS ?creator) ?itemLabel ?random
        WHERE {
        ?item wdt:P31 wd:Q11424;
                wikibase:sitelinks ?sitelinks;
                wdt:P577 ?year;
                wdt:P57 ?creator.
        
        # Fetch the creator's label
        ?creator rdfs:label ?creatorLabel.
        FILTER (lang(?creatorLabel) = "en")
        
        # Filter out unpopular films
        FILTER(?sitelinks > 50)

        SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }

        # Generate a hashed random value
        BIND(SHA512(CONCAT(STR(RAND()), STR(?item))) AS ?random)
        }
        GROUP BY ?item ?itemLabel ?random
        ORDER BY ?random
        LIMIT 5

        # comment, change this before each run to bypass WDQS cache: ${Math.random()}
        `;

    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(filmQuery)}&format=json`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'YourAppName/1.0 (your-email@example.com)'
            }
        });
        const responseText = await response.text();
        console.log('Response:', responseText); // Inspect the raw response

        // Attempt to parse the response only if it's valid JSON
        const data = JSON.parse(responseText);
        queryData = data.results.bindings as QueryResult[];

        for (const result of queryData) {
            const movieTitle = result.itemLabel.value;
            const movieYear = result.year.value;

            const movieImage = await fetchMovieImage(movieTitle, movieYear);

            if (movieImage) {
                result.imageUrl = movieImage;
                filteredQueryData.push(result);
            }
        }

        // Force reassignment to trigger Svelte's reactivity
        filteredQueryData = [...filteredQueryData];

        console.log('Filtered query data:', filteredQueryData);

        return { filteredQueryData };

    } catch (error) {
        console.error('Error fetching data:', error);
    }

    async function fetchMovieImage(title: string, year: string): Promise<string | null> {
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}`;
    
        try {
            const response = await fetch(searchUrl);
            const data = await response.json();
    
            console.log('TMDB API response:', data); // Log the full response for debugging
    
            // Ensure that `data.results` is an array before trying to find a movie
            if (Array.isArray(data.results)) {
                const movie = data.results.find(
                    (movie: { release_date: string; poster_path: string | null }) =>
                        movie.release_date.startsWith(year)
                );
    
                if (movie && movie.poster_path) {
                    return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                }
            } else {
                console.error('No results array found in TMDB response.');
            }
            
            return null; // No image found or no results
        } catch (error) {
            console.error('Error fetching movie image:', error);
            return null;
        }
    }
    
}