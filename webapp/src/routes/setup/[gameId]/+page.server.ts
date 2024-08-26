import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (request) => {
    const { gameId } = request.params;

    if (!gameId) {
        return {
            game: null,
            error: 'Game ID is invalid'
        };
    }

    const { data, error } = await supabase.from("Game").select('Category (id, name, picture_path)').eq('id', gameId);

    if (error) {
        console.error('Error fetching game:', error);
        return {
            category: {} as Partial<Category>,
            error: error.message
        };
    }

    return {
        category: data[0].Category as Partial<Category>,
        error: null
    };
}