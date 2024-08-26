import { supabase } from "$lib/supabaseClient.js";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    const { category_id } = await request.json();

    if (!category_id) {
        return json({status: 'error', error: 'category_id is invalid'});
    }

    const { data, error } = await supabase
    .from('Game')
    .insert([
      { category_id: category_id },
    ])
    .select()        

    if (error) {
        console.error('Error creating game:', error);
        return json({status: 'error', error: error.message});
    }

    const { id } = data[0] ?? '';

    if (!id) {
        return json({status: 'error', error: 'id is invalid'});
    }
    
    return json({status: 'success', game_id: id, error: null});
};
