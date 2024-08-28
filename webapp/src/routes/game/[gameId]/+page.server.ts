import type { PageServerLoad } from './$types';
import { fetchGame, fetchCategory } from '$lib/database';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const { gameId } = params; // Get game_id from the URL
    const gameData = await fetchGame(gameId);

    if (!gameData) {
        console.error('Game not found');
        return { cards: [] };
    }

    const categoryId = gameData.category_id;
    const difficulty = gameData.difficulty;

    // TODO: Add logic here to fetch the right amount of cards based on what is already there.
    // Also the cards need to be "handed" to the players equally in the beginning.
    const numberOfCards = 10;

    const response = await fetch('/api/generate-cards/movies', {
        method: 'POST',
        body: JSON.stringify({ gameId, categoryId, difficulty, numberOfCards }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const { data, error } = await supabase
        .from('Card')
        .select('*')
        .eq('game_id', gameId);

    if (error) {
        throw new Error('Error checking if player exists:' + error.message);
    }

    if (data && data.length > 0) {
        return true;
    }

    return { cards: data as Card[] };
};

