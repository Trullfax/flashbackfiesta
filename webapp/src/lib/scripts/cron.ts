import type { Database } from '$lib/database.types';
import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';

cron.schedule('0 0 * * *', async () => {
	try {
		const supabaseUrl: string = process.env.PUBLIC_SUPABASE_URL ?? '';
		const supabaseKey: string = process.env.PUBLIC_SUPABASE_KEY ?? '';

		const supabase =
			supabaseUrl && supabaseKey ? createClient<Database>(supabaseUrl, supabaseKey) : null;

		const { data: gamesData, error: gamesError } = await supabase.from('Game').select('*');

		if (gamesError) {
			throw new Error('Error fetching game:');
		}

		const gamesToBeDeleted = gamesData.filter((game) => {
			const timeCreated = new Date(game.time_created);
			const currentTime = new Date();

			const timeDifference = currentTime.getTime() - timeCreated.getTime();
			return timeDifference > 3600 * 1000 * 6;
		});

		if (gamesToBeDeleted.length === 0) {
			console.log('No games older than 6 hours to delete.');
			return;
		}

		const deletePromises = gamesToBeDeleted.map(async (game) => {
			await fetch(`${process.env.ORIGIN}api/delete-game`, {
				method: 'POST',
				body: JSON.stringify({ gameId: game.id }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
		});

		await Promise.all(deletePromises);

		console.log('Count of deleted games older than 6 hours: ' + gamesToBeDeleted.length);
	} catch (err) {
		console.log((err as Error).message);
	}
});
