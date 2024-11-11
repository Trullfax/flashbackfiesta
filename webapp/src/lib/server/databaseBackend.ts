import { supabase } from '$lib/server/supabaseBackendClient';

export async function createCard(card: Card) {
	try {
		const { data, error } = await supabase
			.from('Card')
			.insert([
				{
					name: card.name,
					year: card.year,
					creator: card.creator,
					picture_url: card.picture_url,
					category_id: card.category_id,
					game_id: card.game_id
				}
			])
			.select()
			.single();

		if (error || !data) {
			throw new Error('Failed to insert card: ' + (error?.message || 'No data found'));
		}

		return { success: true, card: data, error: null };
	} catch (err) {
		return { success: false, card: {}, error: err };
	}
}

export async function generateCards(
	category: Category,
	game: Game,
	numberOfCards: number,
	fetch: typeof globalThis.fetch
) {
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
			throw new Error(`Failed to generate cards. Status: ${response.status}. Error: ${errorText}`);
		}

		const result = await response.json();

		if (result.success === 'error') {
			throw new Error(result.error || 'Failed to generate cards');
		}

		return { success: true, error: null };
	} catch (err) {
		return { success: false, error: err };
	}
}

export async function updateCardOwner(cardId: string, playerId: string) {
	try {
		const { error: updateError } = await supabase
			.from('Card')
			.update({ player_id: playerId })
			.match({ id: cardId });

		if (updateError) {
			throw new Error(updateError.message);
		}

		return { success: true, error: null };
	} catch (err) {
		return { success: false, error: err };
	}
}

export async function deleteGame(gameId: string) {
	try {
		const { error: deletionError } = await supabase.from('Game').delete().match({ id: gameId });

		if (deletionError) {
			throw new Error('Error deleting game: ' + deletionError.message);
		}

		return { success: true, error: null };
	} catch (err) {
		return { success: false, error: err };
	}
}

export async function setPlayerIsOnline(playerId: string, isOnline: boolean) {
	try {
		const { error: activeError } = await supabase
			.from('Player')
			.update({ is_online: isOnline })
			.match({ id: playerId });

		if (activeError) {
			throw new Error('Error updating player: ' + activeError.message);
		}

		return { success: true, error: null };
	} catch (err) {
		return { success: false, error: err };
	}
}
