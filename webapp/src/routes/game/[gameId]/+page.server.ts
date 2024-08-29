import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ params, fetch }) => {
    try {
        const { gameId } = params;

        if (!gameId) {
            throw new Error("gameId is invalid");
        }

        // Fetch game data from Supabase
        const { data: game, error: gameError } = await supabase
            .from("Game")
            .select('id, difficulty, category_id, Category (api_route, hex_color, name, picture_path, id)')
            .eq('id', gameId)
            .single();

        if (gameError || !game) {
            throw new Error('Error fetching game: ' + (gameError?.message || 'No data found'));
        }

        const category = game.Category as Category;

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

        return {
            game: game as Partial<Game>,
            category: category as Category,
            cards: cardData as Card[],
        };

    } catch (error) {
        return {
            error: (error as Error).message
        };
    }
};
