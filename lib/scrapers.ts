export async function scrapeWebsite(url: string): Promise<any> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/gemini/website`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) throw new Error("Failed to analyze website");
        return await response.json();
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return { fullContent: `Failed to scrape website: ${url}`, insights: {} };
    }
}

export async function processGithub(url: string): Promise<any> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/gemini/github`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) throw new Error("Failed to analyze GitHub repo");
        return await response.json();
    } catch (error) {
        console.error(`Error processing GitHub ${url}:`, error);
        return { fullContent: `Error processing GitHub repo: ${url}`, insights: {} };
    }
}

export async function processYoutube(url: string): Promise<any> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/gemini/youtube`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) throw new Error("Failed to analyze YouTube video");
        return await response.json();
    } catch (error) {
        console.error(`Error processing YouTube ${url}:`, error);
        return { transcript: `Error processing YouTube video: ${url}`, keyMoments: [] };
    }
}
