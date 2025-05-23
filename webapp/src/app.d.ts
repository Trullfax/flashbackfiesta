import type { Database } from '$lib/database.types';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Game {
		id: string;
		status?: Database['public']['Enums']['status'];
		max_card_count: number;
		difficulty: Database['public']['Enums']['difficulty'];
		category_id: string;
		whose_turn_id?: string;
		creator_code: string;
		winner_id?: string;
	}

	interface Category {
		id: string;
		name: string;
		picture_path?: string;
		api_route: string;
		hex_color: string;
	}

	interface Card {
		id: string;
		name: string;
		year: number;
		creator: string;
		picture_url: string;
		category_id: string;
		game_id: string;
		player_id?: string;
		played?: boolean;
	}

	interface Player {
		id: string;
		name: string;
		is_ready: boolean;
		cards_count: number;
		avatar_path: string;
		game_id: string;
		is_creator: boolean;
		is_online: boolean;
	}
}
export {};
