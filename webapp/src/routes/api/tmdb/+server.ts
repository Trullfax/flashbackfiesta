import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
    const TMDB_API_KEY = process.env.TMDB_SECRET_API_KEY;

    const title = url.searchParams.get('title');
    const year = url.searchParams.get('year');

    if (!title || !year) {
        return json({ error: 'Missing title or year parameter' }, { status: 400 });
    }

    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();

        return json(data);
    } catch (error) {
        return json({ error: 'Failed to fetch data from TMDB' }, { status: 500 });
    }
};
