import { createCard } from '$lib/server/databaseBackend';
import { error } from '@sveltejs/kit';
import { getCardsByGameId } from '$lib/database';

export async function generateCardsFromWikidata(sparqlQuery: string, gameId: string, categoryId: string, fetch: typeof globalThis.fetch) {
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
        const cardResult = await getCardsByGameId(gameId);

        if (!cardResult.success) {
            throw new Error(cardResult.error || 'Failed to retrieve existing cards');
        }

        const existingCards = new Set(
            cardResult.data?.map(card => `${card.name}-${card.year}-${card.creator}`) || []
        );
        let addedCards = 0;

        for (const wikidataItem of wikidata) {
            const imageUrl = await fetchTMDBImage(wikidataItem.itemLabel.value, wikidataItem.year.value, fetch);

            if (!imageUrl.success) {
                console.error(`Error fetching image: ${imageUrl.error}`);
                continue;
            }

            const card: Card = {
                id: wikidataItem.item.value.split('/').pop(),
                name: wikidataItem.itemLabel.value,
                year: wikidataItem.year.value,
                creator: wikidataItem.creator.value,
                picture_url: imageUrl.url || '',
                category_id: categoryId,
                game_id: gameId,
            };

            const cardKey = `${card.name}-${card.year}-${card.creator}`;

            // Check for duplicates
            if (existingCards.has(cardKey)) {
                console.warn(`Duplicate card found: ${card.name} (${card.year}). Skipping this card.`);
                continue;
            }

            const { success, error: createCardError } = await createCard(card);

            if (!success) {
                throw new Error(createCardError || `Failed to create card for ${card.name}`);
            }

            // Add this card to the existing cards set
            existingCards.add(cardKey);
            addedCards++;
        }

        return { success: true, addedCards, error: null };
    } catch (err) {
        return { success: false, addedCards: 0, error: `Failed to generate cards: ${(err as Error).message}` };
    }
}

async function fetchTMDBImage(title: string, year: string, fetch: typeof globalThis.fetch) {
    const searchUrl = `/api/tmdb?title=${encodeURIComponent(title)}&year=${year}`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (Array.isArray(data.results)) {
            const item = data.results.find(
                (item: { release_date: string; poster_path: string | null }) =>
                    item.release_date.startsWith(year)
            );

            if (!item || !item.poster_path) {
                throw new Error(`Failed to load image from TMDB for ${title} (${year})`);
            }
            return { success: true, url: `https://image.tmdb.org/t/p/w500${item.poster_path}`, error: null };
        } else {
            throw new Error(`Unexpected response format from TMDB for ${title} (${year})`);
        }
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
}
