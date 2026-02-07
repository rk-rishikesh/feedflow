import { analyzeWebsite } from "./agents/website";
import { analyzeGithub } from "./agents/github";
import { analyzeYoutube } from "./agents/youtube";

export async function scrapeWebsite(url: string): Promise<any> {
    try {
        return await analyzeWebsite(url);
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return { fullContent: `Failed to scrape website: ${url}`, insights: {} };
    }
}

export async function processGithub(url: string): Promise<any> {
    try {
        return await analyzeGithub(url);
    } catch (error) {
        console.error(`Error processing GitHub ${url}:`, error);
        return { fullContent: `Error processing GitHub repo: ${url}`, insights: {} };
    }
}

export async function processYoutube(url: string): Promise<any> {
    try {
        return await analyzeYoutube(url);
    } catch (error) {
        console.error(`Error processing YouTube ${url}:`, error);
        return { transcript: `Error processing YouTube video: ${url}`, keyMoments: [] };
    }
}
