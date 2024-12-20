import { supabase } from "./supabaseClient";

export async function getCardsByGameId(gameId: string): Promise<{ success: boolean; data?: Card[]; error?: string | null }> {
    try {
        const { data, error } = await supabase
            .from('Card')
            .select('*')
            .eq('game_id', gameId);

        if (error || !data) {
            throw new Error('Failed to fetch cards: ' + (error?.message || 'No data found'));
        }

        return { success: true, data: data as Card[], error: null };

    } catch (error) {
        return { success: false, data: [] as Card[], error: (error as Error).message };
    }
}