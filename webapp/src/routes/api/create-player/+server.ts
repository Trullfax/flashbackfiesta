import { supabase } from "$lib/server/supabaseBackendClient";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { gameId, playerName, selectedAvatar } = await request.json();
    
        if (!gameId || gameId.trim() === '') {
            throw new Error('gameId is invalid');
        } else if (!playerName || playerName.trim() === '') {
            throw new Error('playerName is invalid');
        } else if (!selectedAvatar || selectedAvatar.trim() === '') {
            throw new Error('selectedAvatar is invalid');
        }
    
        const playerExists = await checkIfPlayerExists(playerName, gameId);
        if (playerExists) {
            throw new Error('player already exists');
        }
    
        const player: Player = await createPlayer(playerName, selectedAvatar, gameId);
        if (!player) {
            throw new Error('created player is invalid');
        }
    
        return json({ status: 'success', player: player, error: null });
    } catch (error) {
        return json({ status: 'error', player: {}, error: error.message });
    }

};

async function checkIfPlayerExists(playerName: string, gameId: string) {
        const { data, error } = await supabase
            .from('Player')
            .select('name')
            .eq('game_id', gameId)
            .eq('name', playerName);
    
        if (error) {
            throw new Error('Error checking if player exists:' + error.message);
        }
        
        if (data && data.length > 0) {
            return true;
        }
    
        return false;
}

async function createPlayer(playerName: string, selectedAvatar: string, gameId: string) {

        const { data, error } = await supabase
            .from('Player')
            .insert([{ name: playerName, avatar_path: selectedAvatar, game_id: gameId }])
            .select();
    
        if (error) {
            throw new Error('Error creating player:' + error.message);
        }
    
        return data[0];
}
