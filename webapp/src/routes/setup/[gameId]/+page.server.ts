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
            .select('*, Category (*), Player:Player!game_id (*)')
            .eq('id', gameId)
            .single();
    
        if (error) {
            throw new Error('Error fetching game:' + error.message);
        }

        if (data.status !== 'not_started' && data.status !== 'setting_up') {
            throw new Error('Game has already started');
        }
    
        return {
            game: { id: data?.id,
                status: data?.status, 
                whose_turn_id: data?.whose_turn_id,
                max_card_count: data?.max_card_count,
                difficulty: data?.difficulty,
                creator_code: data?.creator_code } as Game,
            category: data.Category as Category,
            players: data.Player as Player[],
            error: null
        };
    } catch (err) {
        error(404, (err as Error).message);
    }
}