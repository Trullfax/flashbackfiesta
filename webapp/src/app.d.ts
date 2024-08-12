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

	type movie = {
        title: string;
        release_date: string | number | Date;
        poster_path: string;
		id: number;
		year: string;
	};
}

export {};
