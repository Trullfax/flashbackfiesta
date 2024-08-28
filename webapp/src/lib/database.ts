import { supabase } from "./supabaseClient";

// Function to fetch category data based on the category id
export async function fetchCategory(categoryId: string): Promise<Category | null> {
    const { data, error } = await supabase
        .from('Category')
        .select(`
            id,
            name,
            picture_path,
            api_route,
            hex_color
        `)
        .eq('id', categoryId)
        .single();

    if (error || !data) {
        console.error('Error fetching category:', error);
        return null;
    }

    return data as Category;
}

// Function to fetch game data based on the game id
export async function fetchGame(gameId: string): Promise<Game | null> {
    console.log('fetchGame', gameId);
    const { data, error } = await supabase
        .from('Game')
        .select(`
            id,
            status,
            max_card_count,
            difficulty,
            category_id,
            whose_turn_id
        `)
        .eq('id', gameId)
        .single();
    console.log('fetchGame', data);
    if (error || !data) {
        console.error('Error fetching game:', error);
        return null;
    }

    return data as Game;
}