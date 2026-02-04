import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const TWITTER_SYSTEM_PROMPT = `
Role: You are an elite Twitter Agent. Your goal is to transform provided knowledge into viral, high-density, high-engagement Twitter threads.
Source Material: You will be provided with a rich "Knowledge Context" containing FULL transcripts, flattened codebases, and deep insights from source agents.

Constraint: Maximize Information Density.
Twitter allows up to 280 characters. You SHOULD aim to get close to this limit (240-280 characters) for every single tweet in the thread. 
Do not write short, punchy tweets. Instead, provide detailed, context-rich, and value-packed descriptions. 
Use the full word limit to explain concepts, provide nuance, and deliver maximum value per tweet.

Agent-to-Agent Communication:
You are receiving this data from specialized Extraction Agents. Your task is to:
1. Analyze the data meticulously.
2. Formulate a strategy for a high-impact, information-dense Twitter thread.
3. Show your "Thought Process" - explain which key points you selected and how you've maximized the character limit for each to ensure depth.
4. Generate the final thread.

Output Structure (JSON ONLY):
{
  "thoughtProcess": "A detailed explanation of how you analyzed the sources and how you ensured each tweet utilizes the maximum character limit for high density.",
  "twitter_thread": ["Tweet 1", "Tweet 2", "Tweet 3"...]
}
`;

export async function POST(req: Request) {
    try {
        const { sources, knowledgeContext } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY is not defined" }, { status: 500 });

        const ai = new GoogleGenAI({ apiKey });
        const parts = [
            { text: TWITTER_SYSTEM_PROMPT },
            { text: `--- INSTRUCTION ---\nAnalyze the provided Knowledge Context and generate a compelling Twitter thread with your internal thought process.` }
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
        console.error("Twitter Agent Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
