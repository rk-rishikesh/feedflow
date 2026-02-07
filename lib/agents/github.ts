import { GoogleGenAI } from "@google/genai";
import { flattenRepo } from "./repo-flattener";

export async function analyzeGithub(url: string) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not defined");

    console.log("GitHub Agent: Analyzing", url);

    // 1. Flatten the repo directly
    const flattenData = await flattenRepo({ repoUrl: url });
    const fullContent = flattenData.content;

    // 2. Extract Key Insights
    const ai = new GoogleGenAI({ apiKey });
    const insightPrompt = `
        You are a Senior Software Architect. Analyze the following flattened codebase and provide a structured technical synthesis.
        REPO URL: ${url}

        TASK:
        1. Summarize the main purpose and architecture.
        2. Identify 5-7 "Key Moments" or critical architectural components/logic flows.
        3. Extract the tech stack and core takeaway.
        
        Return a STRICT JSON object:
        {
            "title": "The exact project name or title",
            "insights": {
                "summary": "...", 
                "coreTakeaway": "...",
                "techStack": [],
                "architectureOverview": "..."
            },
            "keyMoments": [
                { "time": "Component", "description": "..." }
            ]
        }

        CODEBASE:
        ${fullContent.slice(0, 30000)} 
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: insightPrompt }] }],
        config: { responseMimeType: "application/json", temperature: 0 }
    });

    if (!response.text) throw new Error("Failed to get response from Gemini");
    const aiResult = JSON.parse(response.text);

    return {
        title: aiResult.title || "GitHub Repository",
        fullContent,
        insights: aiResult.insights,
        keyMoments: aiResult.keyMoments || [],
        metadata: flattenData.stats
    };
}
