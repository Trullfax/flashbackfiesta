import type { RequestHandler } from './$types';
import { json } from "@sveltejs/kit";
import { generateCardsFromWikidata } from '$lib/server/cardUtils';

export const POST: RequestHandler = async ({ request, fetch }) => {
    try {
        const { gameId, categoryId, difficulty, numberOfCards } = await request.json();

        const sparqlQuery = generateMovieQuery(numberOfCards, difficulty);

        if (!sparqlQuery) {
            throw new Error('Failed to generate SPARQL query');
        }

        const movieLink = 'https://api.themoviedb.org/3/search/movie';

        const { success, addedCards, error } = await generateCardsFromWikidata(sparqlQuery, movieLink, gameId, categoryId, fetch);

        if (!success) {
            throw new Error(error || 'An unknown error occurred while generating cards');
        }

        return json({ status: 'success', message: `${addedCards} cards have been added to this game.`, error: null });
    } catch (error) {
        return json({ status: 'error', message: '', error: (error as Error).message });
    }
};


function generateMovieQuery(numberOfCards: number, difficulty: string): string {
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
        LIMIT ${numberOfCards}

        # comment, change this before each run to bypass WDQS cache: ${Math.random()}
        `;
}