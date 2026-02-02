import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const SUMMARIZER_SYSTEM_PROMPT = `
Role: You are a Expert Knowledge Synthesizer. Your goal is to compress complex information into high-density summaries based on the requested format.
Formats:
- EXECUTIVE SUMMARY: High-level overview, key metrics, and strategic impact.
- KEY TAKEAWAYS: Bulleted list of the most actionable insights.
- CONCEPT MAP: Explanation of how different ideas in the text link together.
- TECHNICAL BRIEF: Focused on architecture, specifications, and implementation details.

Output Structure (JSON ONLY):
{
  "summary": "The formatted summary content"
}
`;

export async function POST(req: Request) {
    try {
        const { sources, format, knowledgeContext } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY is not defined" }, { status: 500 });

        const ai = new GoogleGenAI({ apiKey });
        const parts = [
            { text: SUMMARIZER_SYSTEM_PROMPT },
            { text: `--- INSTRUCTION ---\nSummarize the input in the ${format.toUpperCase()} format.` }
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
        console.error("Summarizer Agent Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
