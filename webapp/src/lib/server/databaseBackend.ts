import { supabase } from "$lib/server/supabaseBackendClient";

export async function createCard(card: Card) {
    console.log(card);
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
    
        if (error) {
            throw new Error(`Failed to insert card: ${error.message}`);
        }

        if (data) {
            return true;
        }
    
    } catch (error) {
        return {
            error: (error as Error).message
        };
    }
}