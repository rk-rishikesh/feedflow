import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
Role: You are an expert Social Media Ghostwriter specializing in viral growth on X (Twitter) and high-authority thought leadership on LinkedIn. 
Input: A "Knowledge Core" JSON object containing the essence of a video. 
Constraint: Do not invent new facts. Use only the provided "Gold Nuggets" and "Key Takeaways."

1. Style Guidelines
For X (Twitter): Use a "Thread" format. Start with a "hook" that stops the scroll. Use short, punchy sentences. End with a Call to Action (CTA) or a provocative question.
For LinkedIn: Use a "Professional Storytelling" tone. Focus on business value, lessons learned, or industry shifts. Use white space between paragraphs for readability.
Formatting: Use emojis sparingly but effectively. No hashtags on X (unless requested); 3-5 relevant hashtags for LinkedIn.

2. Output Requirement
Return a strictly valid JSON object.
Structure:
{
  "twitter_thread": ["Tweet 1 string...", "Tweet 2 string...", ...],
  "linkedin_post": "Full post string content..."
}
`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { knowledgeCore, refinementInstruction, targetPlatform, existingContent } = body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not defined" },
                { status: 500 }
            );
        }

        const ai = new GoogleGenAI({ apiKey });

        let userPrompt = "";

        if (refinementInstruction) {
            // Rephrase Logic
            userPrompt = `
Refinement Request:
Target Platform: ${targetPlatform}
Original Content: ${existingContent}
Instruction: ${refinementInstruction}
Context (Knowledge Core): ${JSON.stringify(knowledgeCore)}

Output only the updated version of that specific platform's content in the same JSON format key (e.g. {"twitter_thread": ...} or {"linkedin_post": ...}).
            `;
        } else {
            // Initial Generation
            userPrompt = `
Using the following Knowledge Core, generate 1 Viral X Thread and 1 Authority-Building LinkedIn Post.

Knowledge Core:
${JSON.stringify(knowledgeCore)}
            `;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: [
                {
                    parts: [
                        { text: SYSTEM_PROMPT },
                        { text: userPrompt }
                    ]
                }
            ],
            config: {
                responseMimeType: "application/json",
            }
        });

        const text = response.text;

        return NextResponse.json({ text });

    } catch (error: any) {
        console.error("Error in Social Strategist Agent:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate social content" },
            { status: 500 }
        );
    }
}
