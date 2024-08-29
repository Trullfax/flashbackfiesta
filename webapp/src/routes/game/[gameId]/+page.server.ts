import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ params, fetch }) => {
    try {
        const { gameId } = params;

        if (!gameId) {
            throw new Error("gameId is invalid");
        }

        // Fetch game data from Supabase
        const { data: gameData, error: gameError } = await supabase
            .from("Game")
            .select('id, difficulty,category_id, Category (*)')
            .eq('id', gameId)
            .single();

        if (gameError || !gameData) {
            throw new Error('Error fetching game: ' + (gameError?.message || 'No data found'));
        }

        const category = gameData.Category as Category;

        if (!category) {
            throw new Error('No category found for this game.');
        }

        if (!category.api_route) {
            throw new Error('No API route found for this game.');
        }

        // Fetch existing cards from Supabase
        const { data: cardData, error: cardError } = await supabase
            .from('Card')
            .select('*')
            .eq('game_id', gameId);

        if (cardError) {
            throw new Error('Error fetching cards: ' + (cardError?.message || 'No data found'));
        }

        console.log('gameData:', gameData);

        return {
            data: {
                game: gameData as Partial<Game>,
                categoryApiRoute: category.api_route,
                cards: cardData as Card[]
            }
        };

    } catch (error) {
        return {
            error: (error as Error).message
        };
    }
};
