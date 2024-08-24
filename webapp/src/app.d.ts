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
}

export {};
