import { getMovies } from "$lib/server/movies";
import type { PageServerLoad } from "./$types";

import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
	const movies = await getMovies(50);
	if (!movies) throw error(400, "No movies found");
	return { movies };
};