import { supabase } from "./supabaseClient";

export async function getCardsByGameId(gameId: string): Promise<{ success: boolean; data?: Card[]; error?: string }> {
    try {
        const { data, error } = await supabase
            .from('Card')
            .select('*')
            .eq('game_id', gameId);

        if (error || !data) {
            throw new Error('Failed to fetch cards: ' + (error?.message || 'No data found'));
        }

        return { success: true, data: data as Card[] };

    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}