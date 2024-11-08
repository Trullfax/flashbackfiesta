import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabaseBackendClient';
import { generateCards, updateCardOwner } from '$lib/server/databaseBackend';
import { getCardsByGameId } from '$lib/database';

const minCardsInDeck: number = 15;
const cardFetch: number = 100;

export const POST: RequestHandler = async ({ request, fetch }) => {
	let rollbackGame: Game | null = null;
	let rollbackPlayer: Player | null = null;
	let rollbackSelectedCard: Card | null = null;

	try {
		const { game, category, selectedCard, cardPos, player } = await request.json();

		if (!game || !category || !selectedCard || cardPos === null || !player) {
			throw new Error('Missing parameters');
		}

		// set rollback variables
		rollbackGame = game;
		rollbackPlayer = player;
		rollbackSelectedCard = selectedCard;

		// check if game is running
		if (game.status !== 'running') {
			throw new Error('Game is not running');
		}

		// check if game has a winner (!= because it can be null or undefined)
		if (game.winner_id != null) {
			throw new Error('Game has a winner');
		}

		// check if player is allowed to play
		if (game.whose_turn_id !== player.id) {
			throw new Error('Not your turn');
		}

		// get all cards from game
		const {
			success: cardsSuccess,
			data: cards,
			error: cardsError
		} = await getCardsByGameId(game.id);

		if (!cardsSuccess || !cards) {
			throw new Error('Failed to fetch cards: ' + cardsError || 'No data found');
		}

		// set needed arrays of cards and sort them by year
		const playedCards: Card[] = cards
			.filter((card) => card.played && card.player_id === null)
			.sort((a, b) => a.year - b.year);

		const cardsInDeck = cards.filter((card) => !card.played && card.player_id === null);

		if (cardsInDeck.length <= 0 || playedCards.length <= 0) {
			throw new Error('No cards in deck');
		}

		// check if card was placed at the correct position
		const {
			success: checkSuccess,
			correct,
			error: checkError
		} = await checkCardPosition(playedCards, selectedCard, cardPos);

		if (!checkSuccess) {
			throw checkError;
		}

		// handle card placement and update card count
		let cardCount: number = player.cards_count;
		let winner: boolean = false;

		if (correct) {
			cardCount -= 1;

			if (Number(cardCount) === 0) {
				winner = true;
			}
		} else {
			// pick a random card from the deck
			const randomCard = cardsInDeck[Math.floor(Math.random() * cardsInDeck.length)];

			updateCardOwner(randomCard.id, player.id);
		}

		// update player card count                                ###rollback!!!
		const { error: playerUpdateError } = await supabase
			.from('Player')
			.update({ cards_count: cardCount })
			.match({ id: player.id });

		if (playerUpdateError) {
			throw new Error(playerUpdateError.message);
		}

		if (winner) {
			// update game status and set winner                   ###rollback!!!
			const { error: gameUpdateError } = await supabase
				.from('Game')
				.update({ status: 'completed', winner_id: player.id })
				.match({ id: game.id });

			if (gameUpdateError) {
				throw new Error(gameUpdateError.message);
			}
		}

		// update selected card                                    ###rollback!!!
		const { error: cardUpdateError } = await supabase
			.from('Card')
			.update({ played: true, player_id: null })
			.match({ id: selectedCard.id });

		if (cardUpdateError) {
			throw new Error(cardUpdateError.message);
		}

		// set next player on whose_turn_id
		const { data: players, error: playersError } = await supabase
			.from('Player')
			.select('id')
			.eq('game_id', game.id);

		if (playersError || !players) {
			throw new Error(playersError.message || 'No data found');
		}

		const playerIndex = players.findIndex((p) => p.id === player.id);

		if (playerIndex === -1) {
			throw new Error('Player not found');
		}

		const nextPlayerIndex = playerIndex + 1 >= players.length ? 0 : playerIndex + 1;

		// update game with next player                            ###rollback!!!
		const { error: nextPlayerError } = await supabase
			.from('Game')
			.update({ whose_turn_id: players[nextPlayerIndex].id })
			.match({ id: game.id });

		if (nextPlayerError) {
			throw new Error(nextPlayerError.message);
		}

		// check if more cards are needed
		if (cardsInDeck.length - 1 <= minCardsInDeck) {
			generateCards(category, game, cardFetch, fetch);
		}

		return json({
			status: 'success',
			correct: correct,
			winner: winner ? (player as Player) : false,
			error: null
		});
	} catch (err) {
		const { success: rollbackSuccess, error: rollbackError } = await rollback(
			rollbackPlayer!,
			rollbackGame!,
			rollbackSelectedCard!
		);

		if (!rollbackSuccess) {
			return json({
				status: 'error',
				error: (err as Error).message + ' ;rollback failed: ' + rollbackError
			});
		}

		return json({
			status: 'error',
			correct: null,
			winner: null,
			error: (err as Error).message
		});
	}
};

async function checkCardPosition(playedCards: Card[], selectedCard: Card, cardPos: number) {
	try {
		let correct: boolean = false;

		const beforeCard = cardPos > 0 ? playedCards[cardPos - 1] : null;
		const afterCard = cardPos < playedCards.length ? playedCards[cardPos] : null;

		if (
			(beforeCard === null || selectedCard.year > beforeCard.year) &&
			(afterCard === null || selectedCard.year < afterCard.year)
		) {
			correct = true;
		}

		return { success: true, correct: correct, error: null };
	} catch (err) {
		return { success: false, correct: false, error: err };
	}
}

async function rollback(player: Player, game: Game, selectedCard: Card) {
	try {
		// rollback the game status
		const { error: rollbackGameUpdateError } = await supabase
			.from('Game')
			.update({ status: game.status, whose_turn_id: player.id, winner_id: game.winner_id })
			.match({ id: game.id });

		if (rollbackGameUpdateError) {
			throw new Error(rollbackGameUpdateError.message);
		}

		// rollback player card count
		const { error: rollbackPlayerUpdateError } = await supabase
			.from('Player')
			.update({ cards_count: player.cards_count })
			.match({ id: player.id });

		if (rollbackPlayerUpdateError) {
			throw new Error(rollbackPlayerUpdateError.message);
		}

		// rollback card update
		const { error: rollbackCardUpdateError } = await supabase
			.from('Card')
			.update({ player_id: selectedCard.player_id, played: false })
			.match({ id: selectedCard.id });

		if (rollbackCardUpdateError) {
			throw new Error(rollbackCardUpdateError.message);
		}

		return { success: true, error: null };
	} catch (err) {
		return { success: false, error: err };
	}
}
