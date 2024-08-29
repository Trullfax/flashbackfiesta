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
            .select('id, difficulty, category_id, Category (api_route, hex_color, name, picture_path, id)')
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

        return {
            game: {
                id: gameData.id,
                category_id: gameData.Category?.id || '',
                difficulty: gameData.difficulty
            },
            cards: cardData as Card[], // Replace with actual card data if needed
            categoryApiRoute : category.api_route
        };

    } catch (error) {
        return {
            error: (error as Error).message
        };
    }
};
