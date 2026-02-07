import { GoogleGenAI } from "@google/genai";

export async function analyzeWebsite(url: string) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not defined");

    console.log("Website Agent: Analyzing", url);

    // 1. Scrape the website
    const scrapeRes = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        }
    });

    if (!scrapeRes.ok) {
        throw new Error(`Failed to fetch website: ${scrapeRes.status} ${scrapeRes.statusText}`);
    }

    const html = await scrapeRes.text();

    // Basic cleanup
    const content = html
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, '')
        .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 30000);

    // 2. Extract Key Insights
    const ai = new GoogleGenAI({ apiKey });
    const insightPrompt = `
        You are an Expert Content Analyst. Analyze the following scraped website content and provide a structured synthesis.
        URL: ${url}

        TASK:
        1. Summarize the main purpose and content.
        2. Identify 3-5 "Key Moments" or major sections/features described on the page.
        3. Extract the core takeaway for someone who hasn't read it.
        
        Return a STRICT JSON object:
        {
            "title": "The exact title of the article or page",
            "insights": {
                "summary": "...", 
                "coreTakeaway": "...",
                "targetAudience": "...",
                "tone": "..."
            },
            "keyMoments": [
                { "time": "Section", "description": "..." }
            ]
        }

        CONTENT:
        ${content}
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: insightPrompt }] }],
        config: { responseMimeType: "application/json", temperature: 0 }
    });

    if (!response.text) throw new Error("Failed to get response from Gemini");
    const aiResult = JSON.parse(response.text);

    return {
        title: aiResult.title || "Website content",
        fullContent: content,
        insights: aiResult.insights,
        keyMoments: aiResult.keyMoments || []
    };
}
