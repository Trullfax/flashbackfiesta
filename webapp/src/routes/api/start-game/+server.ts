import type { RequestHandler } from './$types';
import { json } from "@sveltejs/kit";
import { supabase } from '$lib/server/supabaseBackendClient';

const firstCardFetch: number = 40;
const cardsPerPlayer: number = 5;

export const POST: RequestHandler = async ({ request, fetch }) => {
    try {
        const { game, category, players } = await request.json();

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
    } catch (error) {
        return json({ status: 'error', error: (error as Error).message });
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
            throw cardsError;
        }

        // assign cards to players
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            const playerCards = cards.slice(i * cardsPerPlayer, (i + 1) * cardsPerPlayer);

            for (let j = 0; j < playerCards.length; j++) {
                const card = playerCards[j];
                const { error } = await updateCardOwner(card.id, player.id);

                if (error) {
                    throw error;
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
            throw updateError;
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
            throw error;
        }

        return {success: true, error: null};
    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}

// export const PUT: RequestHandler = async ({ request }) => {
//     try {
//         const { gameID } = await request.json();

//         const { error } = await supabase
//             .from('Game')
//             .update({ status: 'not_started' })
//             .match({ id: gameID });

//         if (error) {
//             throw error;
//         }

//         return json({ status: 'success', error: null });
//     } catch (error) {
//         return json({ status: 'error', error: (error as Error).message });
//     }
// };