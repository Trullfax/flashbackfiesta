import { supabase } from "$lib/supabaseClient";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    const { game_id, player_name, avatar_path } = await request.json();

    if (!game_id || game_id.trim() === '') {
        return json({ status: 'error', player: {}, error: 'game_id is invalid' });
    }
    if (!player_name || player_name.trim() === '') {
        return json({ status: 'error', player: {}, error: 'player_name is invalid' });
    }
    if (!avatar_path || avatar_path.trim() === '') {
        return json({ status: 'error', player: {}, error: 'avatar_path is invalid' });
    }

    const playerExists = await checkIfPlayerExists(player_name, game_id);
    if (playerExists === false) {
        return json({ status: 'error', player: {}, error: 'player already exists' });
    }

    const player: Player = await createPlayer(player_name, avatar_path, game_id);
    if (!player) {
        return json({ status: 'error', player: {}, error: 'error creating player' });
    }

    return json({ status: 'success', player: player, error: null });
};

async function checkIfPlayerExists(player_name: string, game_id: string) {
    const { data, error } = await supabase
        .from('Player')
        .select('name')
        .eq('game_id', game_id)
        .eq('name', player_name);

    if (error) {
        console.error('Error fetching player:', error);
        return false;
    }

    // Handle possible null data
    if (!data || data.length === 0) {
        return true; // Player does not exist
    }

    return false; // Player already exists
}

async function createPlayer(player_name: string, avatar_path: string, game_id: string) {
    const { data, error } = await supabase
        .from('Player')
        .insert([{ name: player_name, avatar_path: avatar_path, game_id: game_id }])
        .select();

    if (error) {
        console.error('Error creating player:', error);
        return {};
    }

    return data[0];
}
