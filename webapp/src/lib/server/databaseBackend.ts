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
            .select()
            .single();
    
        if (error || !data) {
            throw new Error('Failed to insert card: ' + (error?.message || 'No data found'));
        }
    
        return {success: true, card: data, error: null};

    } catch (error) {
        return {success: false, card: {}, error: (error as Error).message};
    }
}

export async function generateCards(category: Category, game: Game, numberOfCards: number, fetch: typeof globalThis.fetch) {
    try {
        const response = await fetch(category.api_route, {
            method: 'POST',
            body: JSON.stringify({
                gameId: game.id,
                categoryId: category.id,
                difficulty: game.difficulty,
                numberOfCards
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Failed to generate cards. Status: ${response.status}. Error: ${errorText}`
            );
        }

        const result = await response.json();

        if (result.success === 'error') {
            throw new Error(result.error || 'Failed to generate cards');
        }

        return {success: true, error: null};
    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}