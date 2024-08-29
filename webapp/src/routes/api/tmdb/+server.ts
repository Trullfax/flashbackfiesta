import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const TMDB_API_KEY = process.env.TMDB_SECRET_API_KEY;
        const { title, year, queryLink } = await request.json();
        const searchUrl = `${queryLink}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}`;

        const response = await fetch(searchUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch data from TMDB');
        }

        const data = await response.json();

        return json({ status: 'success', data: data, error: null });
    } catch (error) {
        return json({ status: 'error', data: {}, error: error });
    }
};
