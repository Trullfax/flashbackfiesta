export async function fetchTMDBImage(title: string, year: string, queryLink: string, fetch: typeof globalThis.fetch) {
    try {
        const tmdbApiKey = process.env.TMDB_SECRET_API_KEY;
        const searchUrl = `${queryLink}?api_key=${tmdbApiKey}&query=${encodeURIComponent(title)}&year=${year}`;

        const response = await fetch(searchUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch data from TMDB');
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            for (const item of data.results) {
                if (item.release_date && item.release_date.startsWith(year)) {
                    if (item.poster_path) {
                        return { success: true, url: `https://image.tmdb.org/t/p/w500${item.poster_path}`, error: null };
                    }
                }
                if (item.first_air_date && item.first_air_date.startsWith(year)) {
                    if (item.poster_path) {
                        return { success: true, url: `https://image.tmdb.org/t/p/w500${item.poster_path}`, error: null };
                    }
                }
            }
        }
        throw new Error('No image found.');
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
}

export async function getSpotifyAccessToken() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const authUrl = 'https://accounts.spotify.com/api/token';
    const encodedAuth = btoa(`${clientId}:${clientSecret}`);

    const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${encodedAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
        throw new Error('Failed to get Spotify access token');
    }

    const data = await response.json();
    return data.access_token;
}

