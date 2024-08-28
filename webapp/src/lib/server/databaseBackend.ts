import { supabase } from "$lib/server/supabaseBackendClient";

export async function createCard(card: Card) {
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
        console.error('Error inserting card:', error);
        throw new Error(`Failed to insert card: ${error.message}`);
    }

    if (data && data.length > 0) {
        return true;
    }
}
