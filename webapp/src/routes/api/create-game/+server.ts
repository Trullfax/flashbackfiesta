import { supabase } from "$lib/server/supabaseBackendClient";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { categoryId } = await request.json();

        if (!categoryId) {
            throw new Error('categoryId is invalid');
        }

        const creatorCode = generateCreatorCode();

        const { data, error } = await supabase
        .from('Game')
        .insert([
        { category_id: categoryId, creator_code: creatorCode },
        ])
        .select()        

        if (error) {
            throw new Error('Error creating game:' + error.message);
        }

        const { id } = data[0] ?? '';

        if (!id) {
            throw new Error('created game is invalid');
        }
        
        return json({status: 'success', gameId: id, creatorCode: creatorCode, error: null});
    } catch (error) {
        return json({ status: 'error', gameId: '', creatorCode: '', error: (error as Error).message });
    } 
};

function generateCreatorCode() {
    return uuidv4();
}

// https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }
