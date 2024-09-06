import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';
import { deleteGame } from "$lib/server/databaseBackend";

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { gameId } = await request.json();

        if (!gameId) {
            throw new Error('gameId is invalid');
        }

        const {success, error} = await deleteGame(gameId);

        if (!success) {
            throw new Error('Failed to delete game: ' + error);
        }

        return json({ status: 'success', error: null });
    } catch (err) {
        return json({ status: 'error', error: (err as Error).message });
    }
};