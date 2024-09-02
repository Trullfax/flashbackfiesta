import type { RequestHandler } from './$types';
import { json } from "@sveltejs/kit";
import { supabase } from '$lib/server/supabaseBackendClient';

const firstCardFetch: number = 100;
const cardsPerPlayer: number = 5;

export const POST: RequestHandler = async ({ request, fetch }) => {
    let gameId: string = '';
    try {
        const { game, category, players } = await request.json();

        if (!game || !category || !players) {
            throw new Error('Invalid request body');
        }

        gameId = game.id;

        // Set game status to setting_up
        const { error: settingUpError } = await supabase
            .from('Game')
            .update({ status: 'setting_up' })
            .match({ id: game.id });

        if (settingUpError) {
            throw new Error(settingUpError.message);
        }

        // Generate cards for carddeck
        const { success: generateSuccess, error: generateError } = await generateCards(category, game, firstCardFetch, fetch);

        if (!generateSuccess) {
            throw generateError;
        }

        // Set first card and assign Cards to players
        const {success: assigningSuccess, error: assigningError} = await assigningCards(game.id, players);

        if (!assigningSuccess) {
            throw assigningError;
        }

        // Choose random player to start
        const randomPlayerId = players[Math.floor(Math.random() * players.length)].id;

        // Update game status to running and set whose_turn_id to random player
        const { error: finalUpdateError } = await supabase
            .from('Game')
            .update({ status: 'running', whose_turn_id: randomPlayerId })
            .match({ id: game.id });

        if (finalUpdateError) {
            throw new Error(finalUpdateError.message);
        }

        return json({ status: 'success' , error: null });
    } catch (err) {
        const { success: rollbackSuccess, error: rollbackError} = await rollback(gameId);

        if (!rollbackSuccess) {
            return json({ status: 'error', error: (err as Error).message + ' ;rollback failed: ' + rollbackError });
        }

        return json({ status: 'error', error: (err as Error).message });
    }
};

async function generateCards(category: Category, game: Game, numberOfCards: number, fetch: typeof globalThis.fetch) {
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
            throw new Error(
                `Failed to generate cards. Status: ${response.status}. Error: ${errorText}`
            );
        }

        const result = await response.json();

        if (result.success === 'error') {
            throw new Error(result.error || 'Failed to generate cards');
        }

        return {success: true, error: null};
    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}

async function assigningCards(gameId: string, players: Player[]) {
    try {
        const { data: cards, error: cardsError } = await supabase
            .from('Card')
            .select('id')
            .eq('game_id', gameId)
            .limit(cardsPerPlayer * players.length + 1);

        if (cardsError) {
            throw new Error(cardsError.message);
        }

        // assign cards to players
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            const playerCards = cards.slice(i * cardsPerPlayer, (i + 1) * cardsPerPlayer);

            for (let j = 0; j < playerCards.length; j++) {
                const card = playerCards[j];
                const { error: updateOwnerError } = await updateCardOwner(card.id, player.id);

                if (updateOwnerError) {
                    throw updateOwnerError;
                }
            }
        }

        // last card is the first card to be played
        const lastCard = cards[cardsPerPlayer * players.length];

        const { error: updateError } = await supabase
            .from('Card')
            .update({ in_deck: true })
            .match({ id: lastCard.id });

        if (updateError) {
            throw new Error(updateError.message);
        }

        return {success: true, error: null};
    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}

async function updateCardOwner(cardId: string, playerId: string) {
    try {
        const { error } = await supabase
            .from('Card')
            .update({ player_id: playerId })
            .match({ id: cardId });

        if (error) {
            throw new Error(error.message);
        }

        return {success: true, error: null};
    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}

async function rollback(gameId: string) {
    try {
        // rollback the game status
        const { error: rollbackStatusError } = await supabase
            .from('Game')
            .update({ status: 'not_started' })
            .match({ id: gameId });

        if (rollbackStatusError) {
            throw new Error(rollbackStatusError.message);
        }

        // rollback the cards
        const { error: rollbackCardsError } = await supabase
            .from('Card')
            .delete()
            .match({ game_id: gameId });

        if (rollbackCardsError) {
            throw new Error(rollbackCardsError.message);
        }

        return {success: true, error: null};
    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}