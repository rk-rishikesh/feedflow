import { GoogleGenAI } from "@google/genai";

export async function analyzeYoutube(url: string) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not defined");

    console.log("YouTube Agent: Analyzing directly via Gemini API", url);

    // Using the new direct YouTube URL support in Gemini 3 Flash
    const ai = new GoogleGenAI({ apiKey });

    const extractionPrompt = `
        You are a YouTube Content Analyst. 
        Analyze the provided YouTube video and extract the most important information.

        TASK:
        1. Identify the main topic/content.
        2. Extract Key Moments or major points.
        3. Provide deep technical/narrative insights.
        4. Create a comprehensive synthesis of the content.

        Return a STRICT JSON object:
        {
            "title": "Clean, descriptive title of the video",
            "transcript": "A deep-dive technical synthesis of the video content.", 
            "keyMoments": [
                { "time": "MM:SS", "description": "Short description" }
            ],
            "insights": {
                "summary": "2-3 sentence overview",
                "coreTakeaway": "The fundamental lesson",
                "techStack": ["Relevant technologies if mentioned"]
            }
        }
    `;

    const contents = [
        {
            fileData: {
                fileUri: url,
                mimeType: "video/mp4" // YouTube URLs are treated as videos/mp4 for multimodal support
            }
        },
        { text: extractionPrompt }
    ];

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: contents,
            config: { responseMimeType: "application/json", temperature: 0.1 }
        });

        if (!response.text) throw new Error("Failed to get response from Gemini");

        const aiResult = JSON.parse(response.text);

        return {
            title: aiResult.title || "YouTube Video",
            transcript: aiResult.transcript || aiResult.insights?.summary || "Synthesis provided by Gemini.",
            keyMoments: aiResult.keyMoments || [],
            insights: aiResult.insights || { summary: aiResult.transcript },
            fullContent: `YouTube Video: ${url}\n\nSynthesis: ${aiResult.transcript || ''}`
        };
    } catch (error: any) {
        console.error("YouTube Agent: direct analysis failed:", error);
        throw new Error(`Failed to analyze YouTube video directly: ${error.message}`);
    }
}
