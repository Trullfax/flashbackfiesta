import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (request) => {
    try {
        const { gameId } = request.params;
    
        if (!gameId) {
            throw new Error("gameIs is invalid");
        }
    
        const { data, error } = await supabase.from("Game").select('Category (id, name, picture_path)').eq('id', gameId);
    
        if (error) {
            throw new Error('Error fetching game:' + error.message);
        }
    
        return {
            category: data[0].Category as Partial<Category>,
            error: null
        };
    } catch (error) {
        return {
            category: {},
            error: error.message
        };
    }
}