import { supabase } from "$lib/server/supabaseBackendClient";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { game_id, player_name, avatar_path } = await request.json();
    
        if (!game_id || game_id.trim() === '') {
            throw new Error('game_id is invalid');
        } else if (!player_name || player_name.trim() === '') {
            throw new Error('player_name is invalid');
        } else if (!avatar_path || avatar_path.trim() === '') {
            throw new Error('avatar_path is invalid');
        }
    
        const playerExists = await checkIfPlayerExists(player_name, game_id);
        if (playerExists) {
            throw new Error('player already exists');
        }
    
        const player: Player = await createPlayer(player_name, avatar_path, game_id);
        if (!player) {
            throw new Error('created player is invalid');
        }
    
        return json({ status: 'success', player: player, error: null });
    } catch (error) {
        return json({ status: 'error', player: {}, error: error.message });
    }

};

async function checkIfPlayerExists(player_name: string, game_id: string) {
        const { data, error } = await supabase
            .from('Player')
            .select('name')
            .eq('game_id', game_id)
            .eq('name', player_name);
    
        if (error) {
            throw new Error('Error checking if player exists:' + error.message);
        }
        
        if (data && data.length > 0) {
            return true;
        }
    
        return false;
}

async function createPlayer(player_name: string, avatar_path: string, game_id: string) {

        const { data, error } = await supabase
            .from('Player')
            .insert([{ name: player_name, avatar_path: avatar_path, game_id: game_id }])
            .select();
    
        if (error) {
            throw new Error('Error creating player:' + error.message);
        }
    
        return data[0];
}
