import type { RequestHandler } from './$types';
import { json } from "@sveltejs/kit";
import { createCard } from '$lib/server/databaseBackend';
import { getCardsByGameId } from '$lib/database';
import { getSpotifyAccessToken } from '$lib/server/cardUtils';

export const POST: RequestHandler = async ({ request, fetch }) => {
    try {
        const { gameId, categoryId, difficulty, numberOfCards } = await request.json();

        const { success, addedCards, error } = await generateCardsFromSpotify(gameId, categoryId, numberOfCards, fetch);

        if (!success) {
            throw new Error(error || 'An unknown error occurred while generating cards');
        }

        return json({ status: 'success', message: `${addedCards} cards have been added to this game.`, error: null });
    } catch (error) {
        return json({ status: 'error', message: '', error: (error as Error).message });
    }
};

async function generateCardsFromSpotify(gameId: string, categoryId: string, numberOfCards: number, fetch: typeof globalThis.fetch) {
    try {
        const { success: cardsRetrievedSuccess, data: cardsRetrievedData, error: cardsRetrievedError } = await getCardsByGameId(gameId);

        if (!cardsRetrievedSuccess) {
            throw new Error(cardsRetrievedError || 'Failed to retrieve existing cards');
        }

        let addedCards = 0;
        const existingCards: Card[] = cardsRetrievedData || [];

        // Fetch songs from Spotify
        const spotifyAccessToken = await getSpotifyAccessToken();
        const tracks = await fetchSpotifyTracks(numberOfCards, spotifyAccessToken, fetch);

        if (!tracks || tracks.length === 0) {
            throw new Error('Failed to fetch data from Spotify');
        }

        // Loop through Spotify tracks
        for (const track of tracks) {
            const trackName = track.name;
            const releaseYear = new Date(track.album.release_date).getFullYear();
            const artistNames = track.artists.map((artist: { name: string }) => artist.name).join(', ');
            
            let duplicateYear = false;
            let duplicateName = false;

            const card: Card = {
                id: '',
                name: trackName,
                year: releaseYear,
                creator: artistNames,
                picture_url: track.album.images?.[0]?.url || '',
                category_id: categoryId,
                game_id: gameId,
            };

            // Check for duplicate name or year
            if (existingCards && existingCards.length !== 0) {
                for (const existingCard of existingCards) {
                    if (Number(existingCard.year) === releaseYear) {
                        duplicateYear = true;
                    }
                    if (String(existingCard.name) === trackName) {
                        duplicateName = true;
                    }
                }
            }

            if (!duplicateYear && !duplicateName) {
                const { success, card: cardInDb, error: createCardError } = await createCard(card);

                if (!success || !cardInDb) {
                    throw new Error(createCardError || `Failed to create card for ${trackName}`);
                }

                existingCards.push(cardInDb as Card);
                addedCards++;
            }

            // Stop if we've added enough cards
            if (addedCards >= numberOfCards) {
                break;
            }
        }

        return { success: true, addedCards, error: null };
    } catch (err) {
        return { success: false, addedCards: 0, error: `Failed to generate cards: ${(err as Error).message}` };
    }
}

async function fetchSpotifyTracks(numberOfCards: number, accessToken: string, fetch: typeof globalThis.fetch) {
    const fetchedTracks: any[] = []; // Array to store unique tracks
    const maxOffset = 100; // Set a maximum offset to limit the randomization range
    const maxAttemptsPerYear = 2; // Max attempts to fetch a valid track per year

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Iterate through the years from 1950 to the current year
    for (let year = 1960; year <= currentYear; year++) {
        let validTrackFound = false; // Flag to check if a valid track is found for the year
        let attempts = 0; // Attempt counter for each year

        while (!validTrackFound && attempts < maxAttemptsPerYear) {
            // Calculate a random offset for each year
            const offset = Math.floor(Math.random() * maxOffset); // Random offset

            // Define the search URL with the desired year and market (Germany)
            const searchUrl = `https://api.spotify.com/v1/search?q=year:${year}&type=track&market=DE&limit=50&offset=${offset}`;

            console.log(`Search URL for year ${year}, attempt ${attempts + 1}: ${searchUrl}`); // Log for debugging

            try {
                const response = await fetch(searchUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', response.status, response.statusText, errorText);
                    break; // Break out of the while loop on error
                }

                const data = await response.json();

                // Check if we have tracks in the response
                if (data.tracks && data.tracks.items.length > 0) {
                    for (const track of data.tracks.items) {
                        // Ensure track is not part of a compilation album, is unique, and has a popularity of at least 70
                        if (
                            track.album.album_type !== 'compilation' && // Exclude compilation albums
                            !fetchedTracks.some(fetched => fetched.id === track.id) && // Ensure the track is unique
                            track.popularity >= 60 // Ensure the track has a popularity of at least 80
                        ) {
                            fetchedTracks.push(track); // Add unique track to the array
                            validTrackFound = true; // Set flag to true since a valid track is found
                            console.log(`Found valid track: ${track.name} from year ${year}`); // Log the found track
                            break; // Exit the for loop since we found a valid track
                        }
                    }
                }

                attempts++; // Increment the attempt counter after each fetch
            } catch (err) {
                console.error('Error fetching tracks for year', year, ':', (err as Error).message);
                break; // Break out of the while loop on error
            }
        }

        // Stop if we've reached the desired number of cards
        if (fetchedTracks.length >= numberOfCards) {
            break;
        }
    }

    // Slice the array to ensure we only return the desired number of unique tracks
    return fetchedTracks.slice(0, numberOfCards);
}


