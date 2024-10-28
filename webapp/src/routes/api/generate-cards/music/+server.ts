import type { RequestHandler } from './$types';
import { json } from "@sveltejs/kit";
import { createCard } from '$lib/server/databaseBackend';
import { getCardsByGameId } from '$lib/database';
import { fetchSpotifyImage } from '$lib/server/cardUtils';

export const POST: RequestHandler = async ({ request, fetch }) => {
    try {
        const { gameId, categoryId, difficulty, numberOfCards } = await request.json();

        const sparqlQuery = generateMusicQuery(numberOfCards, difficulty);

        if (!sparqlQuery) {
            throw new Error('Failed to generate SPARQL query');
        }

        const { success, addedCards, error } = await generateCardsFromWikidata(sparqlQuery, gameId, categoryId, fetch);

        if (!success) {
            throw new Error(error || 'An unknown error occurred while generating cards');
        }

        return json({ status: 'success', message: `${addedCards} cards have been added to this game.`, error: null });
    } catch (error) {
        return json({ status: 'error', message: '', error: (error as Error).message });
    }
};


function generateMusicQuery(numberOfCards: number, difficulty: string): string {
    let sitelinksFilter = '?sitelinks > 7';
    if (difficulty === 'easy') {
        sitelinksFilter = '?sitelinks > 7';
    } else if (difficulty === 'medium') {
        sitelinksFilter = '?sitelinks > 5';
    } else if (difficulty === 'hard') {
        sitelinksFilter = '?sitelinks > 4';
    } else if (difficulty === 'extreme') {
        sitelinksFilter = '?sitelinks > 3';
    }

    return `
        SELECT DISTINCT ?item (MIN(YEAR(?year)) AS ?year) (GROUP_CONCAT(DISTINCT ?creatorLabel; separator=", ") AS ?creator) ?itemLabel ?random
        WHERE {
            ?item wdt:P31 wd:Q105543609;
            wdt:P577 ?year;
            wdt:P175 ?creator;
            wdt:P1651 ?youtubeVideo.

        # Fetch the creator's label
        OPTIONAL { 
            ?creator rdfs:label ?creatorLabel. 
            FILTER (lang(?creatorLabel) = "en")
        }

        # Filter out unpopular music based on sitelinks
        OPTIONAL { 
            ?item wikibase:sitelinks ?sitelinks. 
        }  
        FILTER(BOUND(?sitelinks) && ${sitelinksFilter})
    
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }

        BIND(SHA512(CONCAT(STR(RAND()), STR(?item))) AS ?random)
        }
        GROUP BY ?item ?itemLabel ?random
        ORDER BY ?random
        LIMIT ${numberOfCards}

        # comment, change this before each run to bypass WDQS cache: ${Math.random()}
        `;
}

async function generateCardsFromWikidata(sparqlQuery: string, gameId: string, categoryId: string, fetch: typeof globalThis.fetch) {
    try {
        const wikidataUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;

        const wikidataRes = await fetch(wikidataUrl, {
            headers: {
                'User-Agent': 'flashbackfiesta.app (https://flashbackfiesta.app)',
            }
        });

        const responseText = await wikidataRes.text();
        const wikidata = JSON.parse(responseText).results.bindings;

        if (!wikidata || wikidata.length === 0) {
            throw new Error('Failed to fetch data from Wikidata');
        }

        // Fetch the existing cards from your database
        const { success: cardsRetrievedSuccess, data: cardsRetrievedData, error: cardsRetrievedError } = await getCardsByGameId(gameId);

        if (!cardsRetrievedSuccess) {
            throw new Error(cardsRetrievedError || 'Failed to retrieve existing cards');
        }

        let addedCards = 0;
        const existingCards: Card[] = cardsRetrievedData || [];

        for (const wikidataItem of wikidata) {
            let duplicateYear = false;
            let duplicateName = false;

            const card: Card = {
                id: '',
                name: wikidataItem.itemLabel.value,
                year: wikidataItem.year.value,
                creator: wikidataItem.creator.value,
                picture_url: '',
                category_id: categoryId,
                game_id: gameId,
            };

            if (existingCards && existingCards.length != 0) {
                for (const existingCard of existingCards) {
                    if (Number(existingCard.year) === Number(card.year)) {
                        duplicateYear = true;
                    }
                    if (String(existingCard.name) === String(card.name)) {
                        duplicateName = true;
                    }
                }
            }

            if (!duplicateYear && !duplicateName) {
                const imageUrl = await fetchSpotifyImage(card.name, String(card.year), card.creator.split(','), fetch);

                if (!imageUrl.success) {
                    console.error(`Error fetching image for ${card.name}: ${imageUrl.error}`);
                    continue;
                }

                card.picture_url = imageUrl.url ?? '';

                const { success, card: cardInDb, error: createCardError } = await createCard(card);

                if (!success || !cardInDb) {
                    throw new Error(createCardError || `Failed to create card for ${card.name}`);
                }

                existingCards.push(cardInDb as Card);
                addedCards++;
            } else {
                continue;
            }
        }

        return { success: true, addedCards, error: null };
    } catch (err) {
        return { success: false, addedCards: 0, error: `Failed to generate cards: ${(err as Error).message}` };
    }
}