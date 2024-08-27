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

	interface Category {
		id: string;
		name: string;
		picture_path: string;
		api_route: string;
		hex_color: string;
	}

	interface Player {
		id: string;
		name: string;
		avatar_path: string;
		is_ready: boolean;
		cards_count: number;
		game_id: string;
	}

	interface Game {
		id: string;
		status: string;
		max_card_count: number;
		difficulty: number;
		category_id: string;
		whose_turn_id: string;
	}

	interface Player {
		id: string;
		name: string;
		is_ready: boolean;
		cards_count: number;
		avatar_path: string;
		game_id: string;
	}
}

export {};
