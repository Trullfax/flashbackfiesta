import { supabase } from "$lib/server/supabaseBackendClient";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { gameId } = await request.json();

        if (!gameId) {
            throw new Error('gameId is invalid');
        }

        const { error: deletionError } = await supabase.from('Game').delete().match({ id: gameId });

        if (deletionError) {
            throw new Error('Error deleting game:' + deletionError.message);
        }

        return json({ status: 'success', error: null });
    } catch (err) {
        return json({ status: 'error', error: (err as Error).message });
    }
};