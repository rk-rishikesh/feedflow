import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const TWITTER_SYSTEM_PROMPT = `
Role: You are a elite Twitter Ghostwriter. Your goal is to transform provided knowledge into viral, high-engagement Twitter threads.
Personas:
- THE VIRAL HOOKS: Aggressive, punchy, high-engagement, focuses on growth. Use listicles and strong hooks.
- THE THOUGHT LEADER: Authoritative, lesson-focused, high-value, professional. Focuses on frameworks.
- THE STORYTELLER: Narrative-driven, relatable, starts with a personal or emotional hook.
- THE TECH EVANGELIST: Focused on innovation, future-thinking, technical hype. Use emojis effectively.

Output Structure (JSON ONLY):
{
  "twitter_thread": ["Tweet 1", "Tweet 2", "Tweet 3"...]
}
`;

export async function POST(req: Request) {
    try {
        const { sources, persona, knowledgeContext } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY is not defined" }, { status: 500 });

        const ai = new GoogleGenAI({ apiKey });
        const parts = [
            { text: TWITTER_SYSTEM_PROMPT },
            { text: `--- INSTRUCTION ---\nGenerate a Twitter thread using the ${persona.toUpperCase()} persona.` }
        ];

        if (knowledgeContext) {
            parts.push({ text: `--- KNOWLEDGE CONTEXT ---\n${JSON.stringify(knowledgeContext, null, 2)}` });
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

        return NextResponse.json({ text: response.text });
    } catch (error: any) {
        console.error("Twitter Agent Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
