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

export async function fetchSpotifyImage(title: string, year: string, creators: string[], fetch: typeof globalThis.fetch) {
    try {
        const spotifyAccessToken = await getSpotifyAccessToken();
        const searchUrl = `https://api.spotify.com/v1/search?q=track:${encodeURIComponent(title)}&type=track&market=DE&limit=10&offset=0`;

        const response = await fetch(searchUrl, {
            headers: {
                Authorization: `Bearer ${spotifyAccessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from Spotify');
        }

        const data = await response.json();

        if (data.tracks && data.tracks.items.length > 0) {
            const track = data.tracks.items[0];

            if (creators.some((creator) => track.artists.some((a: { name: string }) => a.name.toLowerCase() === creator.toLowerCase()))) {
                if (track.album.images && track.album.images.length > 0) {
                    return { success: true, url: track.album.images[0].url, error: null };
                }
            }
        }

        throw new Error('No image for the specific search query found.');
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

