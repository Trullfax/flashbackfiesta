import { supabase } from "$lib/server/supabaseBackendClient";

export async function createCard(card: Card) {

    const { data, error } = await supabase
        .from('Card')
        .insert([{
            id: card.id,
            name: card.name,
            year: card.year,
            creator: card.creator,
            picture_url: card.picture_url,
            category_id: card.category_id,
            game_id: card.game_id,

        }])
        .select()
}