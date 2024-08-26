import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (request) => {
    try {
        const { gameId } = request.params;
    
        if (!gameId) {
            throw new Error("gameIs is invalid");
        }
    
        const { data, error } = await supabase.from("Game").select('status, Category (id, name, picture_path), Player:Player!game_id (id, name, is_ready, avatar_path)').eq('id', gameId);
    
        if (error) {
            throw new Error('Error fetching game:' + error.message);
        }
    
        return {
            game: {status: data[0].status} as Partial<Game>,
            category: data[0].Category as Partial<Category>,
            players: data[0].Player as Partial<Player>[],
            error: null
        };
    } catch (error) {
        return {
            gameStatus: {},
            players: [],
            category: {},
            error: error.message
        };
    }
}