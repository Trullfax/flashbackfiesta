import { supabase } from "$lib/server/supabaseBackendClient";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { categoryId } = await request.json();

        if (!categoryId) {
            throw new Error('categoryId is invalid');
        }

        const { data, error } = await supabase
        .from('Game')
        .insert([
        { category_id: categoryId },
        ])
        .select()        

        if (error) {
            throw new Error('Error creating game:' + error.message);
        }

        const { id } = data[0] ?? '';

        if (!id) {
            throw new Error('created game is invalid');
        }
        
        return json({status: 'success', gameId: id, error: null});
    } catch (error) {
        return json({ status: 'error', gameId: '', error: error.message });
    } 
};
