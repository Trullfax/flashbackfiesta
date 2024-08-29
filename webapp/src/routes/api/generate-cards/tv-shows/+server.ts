import type { RequestHandler } from './$types';
import { json } from "@sveltejs/kit";
import { fetchTMDBImage } from '$lib/server/tmdb';
import { createCard } from '$lib/server/databaseBackend';

export const POST: RequestHandler = async ({ request, fetch }) => {
    try {
        const { gameId, categoryId, difficulty, numberOfCards } = await request.json();

        let sparqlQuery = generateTVQuery(numberOfCards, difficulty);

        const wikidataUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;

        const wikidataRes = await fetch(wikidataUrl, {
            headers: {
                'User-Agent': 'flashbackfiesta.app (https://flashbackfiesta.app)',
            }
        });
        const responseText = await wikidataRes.text();
        const wikidata = JSON.parse(responseText).results.bindings;

        for (const result of wikidata) {
            const imageUrl = await fetchTMDBImage(result.itemLabel.value, result.year.value, fetch)

            // TODO: Add further conditions for generating cards, that are no duplicates or have same year etc.
            // TODO: Add a check for the image URL, if it is null, then skip this card but it needs to be replaced with another one.
            if (imageUrl) {
                const card: Card = {
                    id: result.item.value.split('/').pop(),
                    name: result.itemLabel.value,
                    year: result.year.value,
                    creator: result.creator.value,
                    picture_url: imageUrl,
                    category_id: categoryId,
                    game_id: gameId,
                };

                createCard(card);
            }
        }
        return json({ status: 'success', error: null });
    } catch (error) {
        return json({ status: 'error', error: (error as Error).message });
    }
};

function generateTVQuery(numberOfCards: number, difficulty: string): string {
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
        LIMIT ${numberOfCards}

        # comment, change this before each run to bypass WDQS cache: ${Math.random()}
        `;
}

