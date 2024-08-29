export async function fetchTMDBImage(title: string, year: string, fetch: typeof globalThis.fetch): Promise<string | null> {
    const searchUrl = `/api/tmdb?title=${encodeURIComponent(title)}&year=${year}`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (Array.isArray(data.results)) {
            const item = data.results.find(
                // disclaimer: release_date and poster_path are the names of the properties in the TMDB API response
                (item: { release_date: string; poster_path: string | null }) =>
                    item.release_date.startsWith(year)
            );

            if (item && item.poster_path) {
                return `https://image.tmdb.org/t/p/w500${item.poster_path}`;
            }
        }

        return null;
    } catch (error) {
        console.error('Error fetching item image of TMDB:', error);
        return null;
    }
}