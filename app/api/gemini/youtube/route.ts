import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const maxDuration = 120;

export async function POST(req: Request) {
    const apiKey = process.env.GEMINI_API_KEY;

    try {
        const { url } = await req.json();

        if (!apiKey) {
            return NextResponse.json({ error: "GEMINI_API_KEY is not defined" }, { status: 500 });
        }

        if (!url) {
            return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 });
        }

        console.log("Analyzing YouTube video (Direct Gemini Mode):", url);

        // Process with Gemini using only the URL as context
        const ai = new GoogleGenAI({ apiKey });
        const extractionPrompt = `
            You are a YouTube Content Analyst. 
            Analyze the following YouTube video link and extract the most important information:
            URL: ${url}

            TASK:
            1. Using your knowledge and the provided URL, identify the main topic/content.
            2. Extract 5-7 Key Moments or major points covered in the video.
            3. Provide deep insights into the technical/narrative content.
            4. If you cannot access specific details, provide high-quality general insights based on the video's context.

            Return a STRICT JSON object:
            {
                "transcript": "Details extracted from the video content...", 
                "keyMoments": [
                    { "time": "MM:SS", "description": "..." }
                ],
                "insights": {
                    "summary": "",
                    "coreTakeaway": "",
                    "techStack": []
                }
            }
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ role: "user", parts: [{ text: extractionPrompt }] }],
            config: { responseMimeType: "application/json", temperature: 0 }
        });

        if (!response.text) throw new Error("Failed to get response from Gemini");
        const aiResult = JSON.parse(response.text);

        return NextResponse.json({
            transcript: aiResult.transcript || "Information extracted from video URL.",
            keyMoments: aiResult.keyMoments || [],
            insights: aiResult.insights || {},
            fullContent: `YouTube Video: ${url}\n\n${aiResult.transcript || ''}`
        });

    } catch (error: any) {
        console.error("Error in YouTube Direct Source Agent:", error);
        return NextResponse.json({ error: error.message || "Failed to process YouTube video" }, { status: 500 });
    }
}
