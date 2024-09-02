import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const { gameId } = params;

        if (!gameId) {
            throw new Error("gameId is invalid");
        }

        const { data, error} = await supabase
            .from("Game")
            .select('*, Category (*), Player:Player!game_id (*), Card:Card!game_id (*)')
            .eq('id', gameId)
            .single();

        if (error) {
            throw new Error('Error fetching game: ' + error.message );
        }

        if (!data.Category?.api_route) {
            throw new Error('No API route found for this game.');
        }

        if (data.status !== 'running') {
            throw new Error('Game is not running.')
        }

        return {
            game: { id: data?.id,
                    status: data?.status, 
                    whose_turn_id: data?.whose_turn_id,
                    max_card_count: data?.max_card_count,
                    difficulty: data?.difficulty } as Game,
            category: data?.Category as Category,
            cards:  data?.Card as Card[],
            players: data?.Player as Player[]
        };

    } catch (err) {
        error(404, (err as Error).message);
    }
};
