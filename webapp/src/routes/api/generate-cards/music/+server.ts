// https://www.theaudiodb.com/free_music_api
// Most of the basic calls will work using the test API key of "2". 
// Rate Limit
// Maximum 2 calls per second on all API methods

// OR

// https://developer.spotify.com/documentation/web-api/tutorials/getting-started


import type { RequestHandler } from './$types';
import { json } from "@sveltejs/kit";
import { generateCardsFromWikidata } from '$lib/server/cardUtils';

export const POST: RequestHandler = async ({ request, fetch }) => {
    try {
        const { gameId, categoryId, difficulty, numberOfCards } = await request.json();

        const sparqlQuery = generateMusicQuery(numberOfCards, difficulty);

        if (!sparqlQuery) {
            throw new Error('Failed to generate SPARQL query');
        }

        const { success, addedCards, error } = await generateCardsFromWikidata(sparqlQuery, 'music', gameId, categoryId, fetch);

        if (!success) {
            throw new Error(error || 'An unknown error occurred while generating cards');
        }

        return json({ status: 'success', message: `${addedCards} cards have been added to this game.`, error: null });
    } catch (error) {
        return json({ status: 'error', message: '', error: (error as Error).message });
    }
};


function generateMusicQuery(numberOfCards: number, difficulty: string): string {
    let sitelinksFilter = '?sitelinks > 10';
    if (difficulty === 'easy') {
        sitelinksFilter = '?sitelinks > 10';
    } else if (difficulty === 'medium') {
        sitelinksFilter = '?sitelinks > 7';
    } else if (difficulty === 'hard') {
        sitelinksFilter = '?sitelinks > 4';
    } else if (difficulty === 'extreme') {
        sitelinksFilter = '?sitelinks > 2';
    }

    return `
        SELECT DISTINCT ?item (MIN(YEAR(?year)) AS ?year) (GROUP_CONCAT(DISTINCT ?creatorLabel; separator=", ") AS ?creators) ?itemLabel ?random
        WHERE {
        ?item wdt:P31 wd:Q7366;
                wdt:P577 ?year;
                wdt:P175 ?creator;
                wikibase:sitelinks ?sitelinks.
        
         # Fetch the creator's label
        ?creator rdfs:label ?creatorLabel.
        FILTER (lang(?creatorLabel) = "en")
        
        # Filter out unpopular music
        FILTER(${sitelinksFilter})

        SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }

        # Generate a hashed random value
        BIND(SHA512(CONCAT(STR(RAND()), STR(?item))) AS ?random)
        }
        GROUP BY ?item ?itemLabel ?random
        ORDER BY ?random
        LIMIT ${numberOfCards}

        # comment, change this before each run to bypass WDQS cache: ${Math.random()}
        `;
}