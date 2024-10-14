import type { RequestHandler } from './$types';
import { json } from "@sveltejs/kit";
import { generateCardsFromWikidata } from '$lib/server/cardUtils';

export const POST: RequestHandler = async ({ request, fetch }) => {
    try {
        const { gameId, categoryId, difficulty, numberOfCards } = await request.json();

        const sparqlQuery = generateTVQuery(numberOfCards, difficulty);

        if (!sparqlQuery) {
            throw new Error('Failed to generate SPARQL query');
        }
        
        const { success, addedCards, error } = await generateCardsFromWikidata(sparqlQuery, 'tv', gameId, categoryId, fetch);

        if (!success) {
            throw new Error(error || 'An unknown error occurred while generating cards');
        }

        return json({ status: 'success', message: `${addedCards} cards have been added to this game.`, error: null });
    } catch (error) {
        return json({ status: 'error', message: '', error: (error as Error).message });
    }
};

function generateTVQuery(numberOfCards: number, difficulty: string): string {
    let sitelinksFilter = '?sitelinks > 20';
    if (difficulty === 'easy') {
        sitelinksFilter = '?sitelinks > 20';
    } else if (difficulty === 'medium') {
        sitelinksFilter = '?sitelinks > 15';
    } else if (difficulty === 'hard') {
        sitelinksFilter = '?sitelinks > 10';
    } else if (difficulty === 'extreme') {
        sitelinksFilter = '?sitelinks > 5';
    }

    return `
        SELECT DISTINCT ?item (MIN(YEAR(?year)) AS ?year) (GROUP_CONCAT(DISTINCT ?creatorLabel; separator=", ") AS ?creator) ?itemLabel ?random
        WHERE {
        ?item wdt:P31 wd:Q5398426;
            wdt:P580 ?year;
            wdt:P170 ?creator;
            wikibase:sitelinks ?sitelinks.
        
        # Fetch the director's label
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
        LIMIT ${numberOfCards}

        # comment, change this before each run to bypass WDQS cache: ${Math.random()}
    `;
}