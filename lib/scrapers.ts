export async function scrapeWebsite(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        const html = await response.text();

        // Very basic text extraction
        const text = html
            .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, '')
            .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        return text.slice(0, 15000); // Limit size for AI context
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return `Failed to scrape website: ${url}`;
    }
}

export async function processGithub(url: string): Promise<string> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/flatten-repo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ repoUrl: url }),
        });

        if (!response.ok) {
            return `Failed to flatten GitHub repo: ${url}`;
        }

        const data = await response.json();
        return data.content || 'No content found in repository.';
    } catch (error) {
        console.error(`Error processing GitHub ${url}:`, error);
        return `Error processing GitHub repo: ${url}`;
    }
}

export async function processYoutube(url: string): Promise<string> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/gemini/youtube`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            return `Failed to analyze YouTube video: ${url}`;
        }

        const data = await response.json();
        return data.text || 'No content analysis found for video.';
    } catch (error) {
        console.error(`Error processing YouTube ${url}:`, error);
        return `Error processing YouTube video: ${url}`;
    }
}
