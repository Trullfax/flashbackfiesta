function formatISODate(date: Date): string {
    return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
}

export async function GET() {
    // Define your URLs here
    const urls = [
        { loc: '/', lastmod: formatISODate(new Date()) },
        { loc: '/imprint', lastmod: formatISODate(new Date()) }
    ];

    // Convert URLs to XML
    const urlset = urls
        .map(({ loc, lastmod }) => `
            <url>
                <loc>${new URL(loc, 'https://flashbackfiesta.app').toString()}</loc>
                <lastmod>${lastmod}</lastmod>
            </url>
        `.trim())
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    		xmlns:xhtml="https://www.w3.org/1999/xhtml"
			xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
			xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
			xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
			xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
    >
        ${urlset}
    </urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}