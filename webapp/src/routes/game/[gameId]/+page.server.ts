import type { PageServerLoad } from './$types';
import { supabase } from "$lib/supabaseClient.js";

export const load: PageServerLoad = async ({ params, fetch }) => {
    const { gameId } = params; // Get game_id from the URL
    const gameData = await fetchGame(gameId);

    if (!gameData) {
        console.error('Game not found');
        return { filteredQueryData: [] };
    }

    const categoryData = await fetchCategory(gameData.category_id);

    if (!categoryData) {
        console.error('Category not found');
        return { filteredQueryData: [] };
    }

    // TODO: Add logic here to fetch the right amount of cards based on what is already there.
    // Also the cards need to be "handed" to the players equally in the beginning.
    const numberOfCards = 5;

    const cards = await generateCards(gameId, categoryData.name, gameData.category_id, numberOfCards, gameData.difficulty, fetch);

    return { filteredQueryData: cards };
};

// Function to fetch game data based on game_id
async function fetchGame(gameId: string): Promise<Game | null | undefined> {
    const { data, error } = await supabase
        .from('Game') // Use the correct table name
        .select(`
            id,
            status,
            max_card_count,
            difficulty,
            category_id,
            whose_turn_id
        `)
        .eq('id', gameId)
        .single(); // Ensure you get a single record

    if (error || !data) {
        console.error('Error fetching game:', error);
        return null;
    }

    return data as Game;
}

// Function to fetch category based on category_id
async function fetchCategory(categoryId: string): Promise<Category | null> {
    const { data, error } = await supabase
        .from('Category') // Use the correct table name
        .select(`
            id,
            name,
            picture_path,
            api_route,
            hex_color
        `)
        .eq('id', categoryId)
        .single(); // Ensure you get a single record

    if (error || !data) {
        console.error('Error fetching category:', error);
        return null;
    }

    return data as Category;
}


// Function to generate cards based on the category
async function generateCards(gameId: string, categoryName: string | null, categoryId: string, limit: number, difficulty: string, fetch: typeof globalThis.fetch): Promise<Card[]> {
    let sparqlQuery = '';

    // Select the SPARQL query based on the category
    switch (categoryName) {
        case 'Movies':
            sparqlQuery = getMoviesQuery(limit, difficulty);
            break;
        case 'TV-Shows':
            sparqlQuery = getTVShowsQuery(limit, difficulty);
            break;
        // Add more cases for other categories like 'Video Games', 'Music'
        default:
            console.error('Unknown category');
            return [];
    }

    const wikidataUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;

    try {
        const wikidataRes = await fetch(wikidataUrl, {
            headers: {
                'User-Agent': 'flashbackfiesta.app (https://flashbackfiesta.app)',
            }
        });
        const responseText = await wikidataRes.text();
        const wikidata = JSON.parse(responseText).results.bindings;

        const cards: Card[] = [];

        for (const result of wikidata) {
            const imageUrl = (categoryName === 'Movies' || categoryName === 'TV-Shows')
                ? await fetchTMDBImage(result.itemLabel.value, result.year.value, fetch)
                : null;

            // TODO: Add further conditions for generating cards, that are no duplicates or have same year etc.
            if (imageUrl) {
                const card: Card = {
                    id: result.item.value.split('/').pop(),
                    name: result.itemLabel.value,
                    year: result.year.value,
                    creator: result.creator.value,
                    picture_path: imageUrl,
                    category_id: categoryId,
                    game_id: gameId,
                    player_id: 'example_player_id'
                };
                cards.push(card);
            }
        }

        return cards;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// SPARQL queries for generating movies
function getMoviesQuery(limit: number, difficulty: string): string {
    let sitelinksFilter = '?sitelinks > 50';
    if (difficulty === 'easy') {
        sitelinksFilter = '?sitelinks > 50';
    } else if (difficulty === 'medium') {
        sitelinksFilter = '?sitelinks > 30';
    } else if (difficulty === 'hard') {
        sitelinksFilter = '?sitelinks > 20';
    } else if (difficulty === 'extreme') {
        sitelinksFilter = '?sitelinks > 10';
    }

    return `
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
        FILTER(${sitelinksFilter})

        SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }

        # Generate a hashed random value
        BIND(SHA512(CONCAT(STR(RAND()), STR(?item))) AS ?random)
        }
        GROUP BY ?item ?itemLabel ?random
        ORDER BY ?random
        LIMIT ${limit}

        # comment, change this before each run to bypass WDQS cache: ${Math.random()}
        `;
}

// SPARQL queries for generating tv shows
function getTVShowsQuery(limit: number, difficulty: string): string {
    let sitelinksFilter = '?sitelinks > 30';
    if (difficulty === 'easy') {
        sitelinksFilter = '?sitelinks > 30';
    } else if (difficulty === 'medium') {
        sitelinksFilter = '?sitelinks > 20';
    } else if (difficulty === 'hard') {
        sitelinksFilter = '?sitelinks > 10';
    } else if (difficulty === 'extreme') {
        sitelinksFilter = '?sitelinks > 5';
    }

    return `
        SELECT DISTINCT ?item (MIN(YEAR(?year)) AS ?year) (GROUP_CONCAT(DISTINCT ?creatorLabel; separator=", ") AS ?creator) ?itemLabel ?random
        WHERE {
        ?item wdt:P31 wd:Q5398426;
                wikibase:sitelinks ?sitelinks;
                wdt:P577 ?year;
                wdt:P57 ?creator.
        
        # Fetch the creator's label
        ?creator rdfs:label ?creatorLabel.
        FILTER (lang(?creatorLabel) = "en")
        
        # Filter out unpopular films
        FILTER(${sitelinksFilter})

        SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }

        # Generate a hashed random value
        BIND(SHA512(CONCAT(STR(RAND()), STR(?item))) AS ?random)
        }
        GROUP BY ?item ?itemLabel ?random
        ORDER BY ?random
        LIMIT ${limit}

        # comment, change this before each run to bypass WDQS cache: ${Math.random()}
        `;
}

// Function to fetch images from TMDB for Movies and TV Shows
async function fetchTMDBImage(title: string, year: string, fetch: typeof globalThis.fetch): Promise<string | null> {
    const searchUrl = `/api/tmdb?title=${encodeURIComponent(title)}&year=${year}`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (Array.isArray(data.results)) {
            const item = data.results.find(
                // disclaimer: release_date and poster_path are the names of the properties in the TMDB API response
                (item: { release_date: string; poster_path: string | null }) =>
                    item.release_date.startsWith(year)
            );

            if (item && item.poster_path) {
                return `https://image.tmdb.org/t/p/w500${item.poster_path}`;
            }
        }

        return null;
    } catch (error) {
        console.error('Error fetching item image of TMDB:', error);
        return null;
    }
}