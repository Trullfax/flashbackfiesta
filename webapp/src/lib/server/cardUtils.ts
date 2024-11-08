import { createCard } from '$lib/server/databaseBackend';
import { getCardsByGameId } from '$lib/database';

export async function generateCardsFromWikidata(
	sparqlQuery: string,
	queryLink: string,
	gameId: string,
	categoryId: string,
	fetch: typeof globalThis.fetch
) {
	try {
		const wikidataUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;

		const wikidataRes = await fetch(wikidataUrl, {
			headers: {
				'User-Agent': 'flashbackfiesta.app (https://flashbackfiesta.app)'
			}
		});

		const responseText = await wikidataRes.text();
		const wikidata = JSON.parse(responseText).results.bindings;

		if (!wikidata || wikidata.length === 0) {
			throw new Error('Failed to fetch data from Wikidata');
		}

		// Fetch the existing cards from your database
		const {
			success: cardsRetrievedSuccess,
			data: cardsRetrievedData,
			error: cardsRetrievedError
		} = await getCardsByGameId(gameId);

		if (!cardsRetrievedSuccess) {
			throw cardsRetrievedError || 'Failed to retrieve existing cards';
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
				game_id: gameId
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
				const imageUrl = await fetchTMDBImage(
					wikidataItem.itemLabel.value,
					wikidataItem.year.value,
					queryLink,
					fetch
				);

				if (!imageUrl.success) {
					console.error(`Error fetching image: ${imageUrl.error}`);
					continue;
				}

				card.picture_url = imageUrl.url ?? '';

				const { success, card: cardInDb, error: createCardError } = await createCard(card);

				if (!success || !cardInDb) {
					throw createCardError || `Failed to create card for ${card.name}`;
				}

				existingCards.push(cardInDb as Card);
				addedCards++;
			} else {
				continue;
			}
		}

		return { success: true, addedCards, error: null };
	} catch (err) {
		return {
			success: false,
			addedCards: 0,
			error: `Failed to generate cards: ${(err as Error).message}`
		};
	}
}

async function fetchTMDBImage(
	title: string,
	year: string,
	queryLink: string,
	fetch: typeof globalThis.fetch
) {
	try {
		const TMDB_API_KEY = process.env.TMDB_SECRET_API_KEY;
		const searchUrl = `${queryLink}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}`;

		const response = await fetch(searchUrl);

		if (!response.ok) {
			throw new Error('Failed to fetch data from TMDB');
		}

		const data = await response.json();

		if (data.results && data.results.length > 0) {
			for (const item of data.results) {
				if (item.release_date && item.release_date.startsWith(year)) {
					if (item.poster_path) {
						return {
							success: true,
							url: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
							error: null
						};
					}
				}
				if (item.first_air_date && item.first_air_date.startsWith(year)) {
					if (item.poster_path) {
						return {
							success: true,
							url: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
							error: null
						};
					}
				}
			}
		}
		throw new Error('No image found.');
	} catch (err) {
		return { success: false, error: (err as Error).message };
	}
}
