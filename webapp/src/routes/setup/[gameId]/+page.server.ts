import { supabase } from "$lib/supabaseClient";
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const { gameId } = params;
    
        if (!gameId) {
            throw new Error("gameId is invalid");
        }
    
        const { data, error } = await supabase
            .from("Game")
            .select('status, creator_code, Category (id, name, picture_path), Player:Player!game_id (id, name, is_ready, avatar_path)')
            .eq('id', gameId)
            .single();
    
        if (error) {
            throw new Error('Error fetching game:' + error.message);
        }

        if (data.status !== 'not_started') {
            throw new Error('Game has already started');
        }
    
        return {
            game: {status: data.status, creator_code: data.creator_code} as Partial<Game>,
            category: data.Category as Partial<Category>,
            players: data.Player as Partial<Player>[],
            error: null
        };
    } catch (err) {
        error(404, (err as Error).message);
    }
}