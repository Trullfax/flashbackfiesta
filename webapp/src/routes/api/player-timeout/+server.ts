import { supabase } from '$lib/server/supabaseBackendClient';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteGame } from '$lib/server/databaseBackend';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { player, gameId } = await request.json();

		const { data, error: dataError } = await supabase
			.from('Game')
			.select('*, Player:Player!game_id (*)')
			.eq('id', gameId)
			.single();

		if (dataError || !data) {
			throw new Error('Failed to get players: ' + dataError.message || 'No data found');
		}

		const game: Game = {
			id: data?.id,
			status: data?.status,
			whose_turn_id: data?.whose_turn_id,
			max_card_count: data?.max_card_count,
			difficulty: data?.difficulty,
			winner_id: data?.winner_id
		} as Game;

		const playerArray: Player[] = data.Player as Player[];

		if (game.status === 'not_started') {
			if (player.is_creator) {
				// Delete the game
				const { success, error } = await deleteGame(game.id);

				if (!success) {
					throw error;
				}
			} else {
				// Remove the player from the game
				const { success, error } = await deletePlayer(player.id);

				if (!success) {
					throw error;
				}
			}
		}

		if (game.status !== 'not_started') {
			if (playerArray.length <= 1) {
				// Delete the game (this will doesnt work if the player is the only player, but it will stay here for now)
				const { success, error } = await deleteGame(game.id);

				if (!success) {
					throw error;
				}
			}

			if (String(game.whose_turn_id) === String(player.id)) {
				// Set a new player as the player on turn
				const { success: nextPlayerSuccess, error: nextPlayerError } = await setNextPlayerTurn(
					playerArray as Player[],
					player,
					game.id
				);

				if (!nextPlayerSuccess) {
					throw nextPlayerError;
				}

				// Remove the player from the game
				const { success: deletionSuccess, error: deletionError } = await deletePlayer(player.id);

				if (!deletionSuccess) {
					throw deletionError;
				}
			} else {
				// Remove the player from the game
				const { success, error } = await deletePlayer(player.id);

				if (!success) {
					throw error;
				}
			}
		}

		return json({ status: 'success', error: null });
	} catch (err) {
		return json({ status: 'error', error: (err as Error).message });
	}
};

async function deletePlayer(playerId: string) {
	try {
		const { error } = await supabase.from('Player').delete().match({ id: playerId });

		if (error) {
			throw new Error('Failed to delete player: ' + error.message);
		}

		return { success: true, error: null };
	} catch (err) {
		return { success: false, error: err };
	}
}

async function setNextPlayerTurn(players: Player[], player: Player, gameId: string) {
	try {
		const playerIndex = players.findIndex((p) => p.id === player.id);

		if (playerIndex === -1) {
			throw new Error('Player not found');
		}

		const nextPlayerIndex = playerIndex + 1 >= players.length ? 0 : playerIndex + 1;

		// update game with next player                            ###rollback!!!
		const { error: nextPlayerError } = await supabase
			.from('Game')
			.update({ whose_turn_id: players[nextPlayerIndex].id })
			.match({ id: gameId });

		if (nextPlayerError) {
			throw new Error(nextPlayerError.message);
		}

		return { success: true, error: null };
	} catch (err) {
		return { success: false, error: err };
	}
}

// Case 1: Player is the creator and game not started
// Delete the game

// Case 2: Player is not the creator and game not started
// Remove the player from the game

// Case 3: Game is running and player is not the player on turn
// Remove the player from the game

// Case 4: Game is running and player is the player on turn
// Set a new player as the player on turn
// Remove the player from the game

// Case 5: Game is running and player is the only player
// Delete the game
