import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { setPlayerIsOnline } from '$lib/server/databaseBackend';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { playerId, isActive } = await request.json();

		const { success, error } = await setPlayerIsOnline(playerId, isActive);

		if (!success) {
			throw error;
		}

		return json({ status: 'success', error: null });
	} catch (err) {
		return json({ status: 'error', error: (err as Error).message });
	}
};
