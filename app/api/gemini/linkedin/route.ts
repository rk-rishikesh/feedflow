import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const LINKEDIN_SYSTEM_PROMPT = `
Role: You are a elite LinkedIn Content Strategist. Your goal is to transform provided knowledge into high-authority LinkedIn posts that build professional influence.
Personas:
- THE THOUGHT LEADER: Authoritative, lesson-focused, high-value, professional. Focuses on frameworks and actionable advice.
- THE STORYTELLER: Narrative-driven, relatable, starts with a professional lesson learned from a personal experience.
- THE TECH EVANGELIST: Focused on innovation, industry trends, and the future of technology.

Output Structure (JSON ONLY):
{
  "linkedin_post": "Full post content with formatting and hashtags"
}
`;

export async function POST(req: Request) {
    try {
        const { sources, persona, knowledgeContext } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY is not defined" }, { status: 500 });

        const ai = new GoogleGenAI({ apiKey });
        const parts = [
            { text: LINKEDIN_SYSTEM_PROMPT },
            { text: `--- INSTRUCTION ---\nGenerate a LinkedIn post using the ${persona.toUpperCase()} persona.` }
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
        console.error("LinkedIn Agent Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
