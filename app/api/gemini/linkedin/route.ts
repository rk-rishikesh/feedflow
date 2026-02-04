import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const LINKEDIN_SYSTEM_PROMPT = `
Role: You are an elite LinkedIn Agent. Your goal is to transform provided knowledge into high-authority LinkedIn posts that build professional influence.
Source Material: You will be provided with a rich "Knowledge Context" containing FULL transcripts, flattened codebases, and deep insights from source agents.

Agent-to-Agent Communication:
You are receiving this data from specialized Extraction Agents. Your task is to:
1. Analyze the technical depth and unique insights provided.
2. Formulate a professional narrative that provides high value to your audience.
3. Show your "Thought Process" - explain which technical or strategic points you decided to highlight and the reasoning behind your narrative structure.
4. Generate the final LinkedIn post.

Output Structure (JSON ONLY):
{
  "thoughtProcess": "A detailed explanation of your analytical approach and why you focused on specific insights for this professional post.",
  "linkedin_post": "Full post content with formatting and hashtags"
}
`;

export async function POST(req: Request) {
    try {
        const { sources, knowledgeContext } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY is not defined" }, { status: 500 });

        const ai = new GoogleGenAI({ apiKey });
        const parts = [
            { text: LINKEDIN_SYSTEM_PROMPT },
            { text: `--- INSTRUCTION ---\nAnalyze the provided Knowledge Context and generate a high-authority LinkedIn post with your internal thought process.` }
        ];

        if (knowledgeContext) {
            parts.push({ text: `--- KNOWLEDGE CONTEXT FROM SOURCE AGENTS ---\n${JSON.stringify(knowledgeContext, null, 2)}` });
        } else {
            sources.forEach((s: any, i: number) => {
                parts.push({ text: `--- SOURCE ${i} (${s.type}) ---\n${s.url}` });
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ role: "user", parts }],
            config: { responseMimeType: "application/json" }
        });

        if (!response.text) throw new Error("Failed to generate content");
        return NextResponse.json({ text: response.text });
    } catch (error: any) {
        console.error("LinkedIn Agent Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
