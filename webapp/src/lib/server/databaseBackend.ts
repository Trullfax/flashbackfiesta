import { supabase } from "$lib/server/supabaseBackendClient";

export async function createCard(card: Card) {
    try {
        const { data, error } = await supabase
            .from('Card')
            .insert([{
                name: card.name,
                year: card.year,
                creator: card.creator,
                picture_url: card.picture_url,
                category_id: card.category_id,
                game_id: card.game_id,
            }])
            .select();
    
        if (error || !data) {
            throw new Error('Failed to insert card: ' + (error?.message || 'No data found'));
        }
    
        return {success: true, error: null};

    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}