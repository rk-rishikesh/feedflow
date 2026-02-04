import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { url } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY is not defined" }, { status: 500 });

        console.log("GitHub Source Agent: Processing", url);

        // 1. Flatten the repo
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const flattenRes = await fetch(`${baseUrl}/api/flatten-repo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ repoUrl: url }),
        });

        if (!flattenRes.ok) {
            const errText = await flattenRes.text();
            throw new Error(`Failed to flatten repository: ${errText}`);
        }

        const flattenData = await flattenRes.json();
        const fullContent = flattenData.content;

        // 2. Extract Key Insights using Gemini / Standardized Schema
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

        return NextResponse.json({
            fullContent,
            insights: aiResult.insights,
            keyMoments: aiResult.keyMoments || [],
            metadata: flattenData.stats
        });

    } catch (error: any) {
        console.error("GitHub Source Agent Error:", error);
        return NextResponse.json({ error: error.message || "Failed to analyze repository" }, { status: 500 });
    }
}
