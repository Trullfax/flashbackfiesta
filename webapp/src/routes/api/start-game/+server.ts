import type { RequestHandler } from './$types';
import { json } from "@sveltejs/kit";
import { supabase } from '$lib/server/supabaseBackendClient';

export const PUT: RequestHandler = async ({ request }) => {
    try {
        const { gameId } = await request.json();

        const { data, error } = await supabase
            .from('Game')
            .update({ status: 'running' })
            .match({ id: gameId });

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error('Game not found');
        }

        return json({ status: 'success' , error: null });
    } catch (error) {
        return json({ status: 'error', error: (error as Error).message });
    }
};