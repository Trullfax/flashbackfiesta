import { supabase } from "$lib/server/supabaseBackendClient";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { game, isCreator, playerName, selectedAvatar } = await request.json();
    
        if (!game || !game.id) {
            throw new Error('game is invalid');
        } else if (game.status !== 'not_started') {
            throw new Error('game has already started');
        } else if (!playerName || playerName.trim() === '') {
            throw new Error('playerName is invalid');
        } else if (!selectedAvatar || selectedAvatar.trim() === '') {
            throw new Error('selectedAvatar is invalid');
        }
    
        const { success: ExistingSuccess, playerExists, error: ExistingError } = await checkIfPlayerExists(playerName, game.id);

        if (!ExistingSuccess) {
            throw ExistingError;
        } else if (playerExists) {
            throw new Error('player already exists');
        }

        const { success: limitSuccess, limitReached, error: limitError } = await checkPlayerLimit(game.id);

        if (!limitSuccess) {
            throw limitError;
        } else if (limitReached) {
            throw new Error('player limit reached');
        }

        const { success: createSuccess, player, error: createError } = await createPlayer(playerName, isCreator, selectedAvatar, game.id);

        if (!createSuccess) {
            throw createError;
        }
    
        return json({ status: 'success', player: player, error: null });
    } catch (error) {
        return json({ status: 'error', player: {}, error: (error as Error).message });
    }

};

async function checkIfPlayerExists(playerName: string, gameId: string) {
    try {
        const { data, error } = await supabase
            .from('Player')
            .select('name')
            .eq('game_id', gameId)
            .eq('name', playerName);
    
        if (error) {
            throw new Error('Error checking if player exists:' + error.message);
        }
        
        if (data && data.length > 0) {
            return { success: true, playerExists: true, error: null };
        }
    
        return { success: true, playerExists: false, error: null };
    } catch (error) {
        return { success: false, playerExists: false, error: (error as Error).message };
    }
}

async function createPlayer(playerName: string, isCreator: boolean, selectedAvatar: string, gameId: string) {
    try {
        const { data, error } = await supabase
            .from('Player')
            .insert([{ name: playerName, is_creator: isCreator, avatar_path: selectedAvatar, game_id: gameId }])
            .select().single();
    
        if (error) {
            throw new Error('Error creating player:' + error.message);
        }
    
        return { success: true, player: data as Player, error: null };
    } catch (error) {
        return { success: false, player: {}, error: (error as Error).message };
    }
}

async function checkPlayerLimit(gameId: string) {
    try {
        const { data, error } = await supabase
            .from('Player')
            .select('name')
            .eq('game_id', gameId);
    
        if (error) {
            throw new Error('Error checking player limit:' + error.message);
        }
        
        if (data && data.length >= 4) {
            return { success: true, limitReached: true, error: null };
        }
    
        return { success: true, limitReached: false, error: null };
    } catch (error) {
        return { success: false, limitReached: false, error: (error as Error).message };
    }
}